(function(Scratch) {
    'use strict';

    // Ensure the Scratch object exists.
    if (typeof Scratch === "undefined") {
        console.error("Scratch object not found. Extension cannot be loaded.");
        return;
    }

    console.log("HTML Overlay extension is loading.");

    // Global variables for the overlay and observer.
    let overlayDiv = null;
    let observer = null;
    // Object to store event flags per element id and event type.
    // Structure: { elementId: { nativeEventName: flag, ... } }
    const elementEventFlags = {};

    // Local variable for hover state (used only for the button, not as a block anymore).
    let hoverState = false;

    

    // Maps user-friendly event names to native DOM event names.
    function mapEventName(eventName) {
        switch(eventName) {
            case "clicked": return "click";
            case "changed": return "change";
            case "mouseover": return "mouseover";
            case "mouseenter": return "mouseenter";
            case "mouseup": return "mouseup";
            case "mousedown": return "mousedown";
            default: return eventName;
        }
    }

    // Attaches an event listener for the given native event on the specified element,
    // if not already attached.
    function ensureElementListener(nativeEvent, elementId) {
        if (!elementEventFlags[elementId]) {
            elementEventFlags[elementId] = {};
        }
        if (!(nativeEvent in elementEventFlags[elementId])) {
            elementEventFlags[elementId][nativeEvent] = false;
            let elem = document.getElementById(elementId);
            let listener;
            if (elem) {
                listener = function() {
                    elementEventFlags[elementId][nativeEvent] = true;
                };
                elem.addEventListener(nativeEvent, listener);
            } else {
                // Fallback: event delegation if the element isn't yet available.
                listener = function(event) {
                    let target = event.target;
                    while (target) {
                        if (target.id === elementId) {
                            elementEventFlags[elementId][nativeEvent] = true;
                            break;
                        }
                        target = target.parentElement;
                    }
                };
                document.addEventListener(nativeEvent, listener);
            }
            // Store the listener for potential cleanup.
            elementEventFlags[elementId][nativeEvent + '_listener'] = listener;
        }
    }

    // Hat block function: Checks if the event has fired on the element,
    // resets the flag, and returns true if it has.
    function whenElementEvent(args) {
        let elementId = args.elementId;
        let eventChoice = args.event;
        let nativeEvent = mapEventName(eventChoice);
        ensureElementListener(nativeEvent, elementId);
        if (elementEventFlags[elementId] && elementEventFlags[elementId][nativeEvent]) {
            elementEventFlags[elementId][nativeEvent] = false;
            return true;
        }
        return false;
    }

    // Boolean reporter: checks if the even has fired, and returns true if it has.
    function isElementEvent(args) {
        const elementId = args.elementId;
        const eventChoice = args.event;
        const nativeEvent = mapEventName(eventChoice);
        const timeoutDuration = args.timeout || 2000;
    
        return new Promise((resolve) => {
            const element = document.getElementById(elementId);
            if (!element) {
                resolve(false);
                return;
            }
    
            // If the event is "hover", check immediately using matches(':hover').
            if (nativeEvent === 'mouseover' || nativeEvent === 'mouseenter') {
                resolve(element.matches(':hover'));
                return;
            }
    
            // Define the event handler.
            const handler = () => {
                element.removeEventListener(nativeEvent, handler);
                clearTimeout(timeoutId);
                resolve(true);
            };
    
            element.addEventListener(nativeEvent, handler);
    
            // Timeout to clean up the listener.
            const timeoutId = setTimeout(() => {
                element.removeEventListener(nativeEvent, handler);
                resolve(false);
            }, timeoutDuration);
        });
    }

    // Creates the overlay div positioned above the TurboWarp stage.
    function createOverlay() {
        if (overlayDiv) overlayDiv.remove(); // Remove existing overlay if present.
        const stage = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp");
        if (!stage) {
            console.error("Stage not found! Verify the stage selector.");
            return;
        }
        overlayDiv = document.createElement("div");
        overlayDiv.id = "tw-html-overlay";
        overlayDiv.style.position = "fixed";
        overlayDiv.style.pointerEvents = "auto";
        overlayDiv.style.zIndex = "9999";
        overlayDiv.style.overflow = "hidden";
        overlayDiv.style.background = "transparent";
        document.body.appendChild(overlayDiv);
    }

    // Updates the overlay's size and position to match the TurboWarp stage.
    function updateOverlaySize() {
        const stage = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp");
        if (!stage || !overlayDiv) return;
        const rect = stage.getBoundingClientRect();
        overlayDiv.style.width = `${rect.width}px`;
        overlayDiv.style.height = `${rect.height}px`;
        overlayDiv.style.left = `${rect.left}px`;
        overlayDiv.style.top = `${rect.top}px`;
    }

    // Observes changes in the stage (e.g., resizing) so the overlay stays in sync.
    function observeCanvasResize() {
        if (observer) observer.disconnect();
        const stage = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp");
        if (!stage) return;
        observer = new MutationObserver(updateOverlaySize);
        observer.observe(stage, { attributes: true, childList: true, subtree: true });
        window.addEventListener("resize", updateOverlaySize);
    }

    // Stops observing changes in the stage.
    function stopCanvasResizeObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        window.removeEventListener("resize", updateOverlaySize);
    }

    // Inserts HTML relative to an existing element in the overlay.
    function insertHTML(position, html, elementId) {
        if (!overlayDiv) {
            console.error("Overlay not enabled!");
            return;
        }
        let target = document.getElementById(elementId);
        if (!target) {
            console.error(`Element with ID '${elementId}' not found!`);
            return;
        }
        const newElement = document.createElement("div");
        newElement.innerHTML = html;
        if (position === "replace") {
            newElement.id = elementId;
        }
        switch (position) {
            case "replace":
                target.replaceWith(newElement);
                break;
            case "add before":
                target.parentElement.insertBefore(newElement, target);
                break;
            case "add after":
                if (target.nextSibling) {
                    target.parentElement.insertBefore(newElement, target.nextSibling);
                } else {
                    target.parentElement.appendChild(newElement);
                }
                break;
            default:
                console.error("Invalid position! Use 'replace', 'add before', or 'add after'.");
        }
    }

    // Reporter block: Gets the "data-value" attribute from the element with the given id.
    function getElementAttribute(args) {
        let elementId = args.elementId;
        let elem = document.getElementById(elementId);
        return elem ? elem.getAttribute("data-value") || "" : "";
    }

    // Command block: Sets the "data-value" attribute on the element with the given id.
    function setElementAttribute(args) {
        let elementId = args.elementId;
        let content = args.content;
        let elem = document.getElementById(elementId);
        if (elem) elem.setAttribute("data-value", content);
    }

    //––– EXTENSION DEFINITION –––
    const extension = {
        getInfo() {
            return {
                id: 'htmlOverlay',
                name: 'HTML Overlay',
                blocks: [
                    {
                        opcode: 'enableOverlay',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Enable HTML Overlay',
                        func: 'enableOverlay'
                    },
                    {
                        opcode: 'disableOverlay',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Disable HTML Overlay',
                        func: 'disableOverlay'
                    },
                    {
                        opcode: 'loadCustomHTML',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Load HTML [html]',
                        arguments: {
                            html: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<p>Hello World!</p>'
                            }
                        },
                        func: 'loadCustomHTML'
                    },
                    {
                        opcode: 'modifyHTML',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[position] HTML [html] to [elementId]',
                        arguments: {
                            position: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'htmlInsertOptions'
                            },
                            html: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<p>New Content</p>'
                            },
                            elementId: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'target-id'
                            }
                        },
                        func: 'modifyHTML'
                    },
                    {
                        opcode: 'whenElementEvent',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when element [elementId] [event]',
                        arguments: {
                            elementId: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myElement'
                            },
                            event: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'eventOptions',
                                defaultValue: 'clicked'
                            }
                        },
                        func: 'whenElementEvent'
                    },
                    {
                        // Boolean reporter block now uses the same logic as the hat block.
                        opcode: 'isElementEvent',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [elementId] [event]?',
                        arguments: {
                            elementId: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myElement'
                            },
                            event: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'eventOptions',
                                defaultValue: 'clicked'
                            }
                        },
                        func: 'whenElementEvent'
                    },
                    {
                        opcode: 'getElementAttribute',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get attribute of element [elementId]',
                        arguments: {
                            elementId: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myElement'
                            }
                        },
                        func: 'getElementAttribute'
                    },
                    {
                        opcode: 'setElementAttribute',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set attribute of element [elementId] to [content]',
                        arguments: {
                            elementId: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'myElement'
                            },
                            content: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'new value'
                            }
                        },
                        func: 'setElementAttribute'
                    },
                    {
                        opcode: 'updateOverlaySize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Update HTML Overlay Size',
                        func: 'updateOverlaySize'
                    },
                    {
                        opcode: 'startResizeObserver',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Start Overlay Resize Observer',
                        func: 'startResizeObserver'
                    },
                    {
                        opcode: 'stopResizeObserver',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Stop Overlay Resize Observer',
                        func: 'stopResizeObserver'
                    }
                ],
                menus: {
                    htmlInsertOptions: {
                        acceptReporters: false,
                        items: ["replace", "add before", "add after"]
                    },
                    eventOptions: {
                        acceptReporters: false,
                        items: ["clicked", "changed", "mouseover", "mouseenter", "mouseup", "mousedown"]
                    }
                }
            };
        },

        enableOverlay() {
            createOverlay();
        },

        disableOverlay() {
            if (overlayDiv) overlayDiv.remove();
            overlayDiv = null;
            stopCanvasResizeObserver();
        },

        loadCustomHTML(args) {
            if (!overlayDiv) createOverlay();
            overlayDiv.innerHTML = args.html;
        },

        modifyHTML(args) {
            insertHTML(args.position, args.html, args.elementId);
        },

        // Hat block logic is shared for the boolean reporter.
        whenElementEvent: whenElementEvent,
        isElementEvent: isElementEvent,

        getElementAttribute: getElementAttribute,
        setElementAttribute: setElementAttribute,
        updateOverlaySize: updateOverlaySize,
        startResizeObserver() {
            observeCanvasResize();
        },
        stopResizeObserver() {
            stopCanvasResizeObserver();
        }
    };

    Scratch.extensions.register(extension);
})(Scratch);
