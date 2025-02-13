// WARNING: DO NOT RUN. SEVERE PERFORMANCE ISSUES
(function(Scratch) {
    'use strict';

    if (typeof Scratch === "undefined") {
        console.error("Scratch object not found. Extension cannot be loaded.");
        return;
    }

    let currentStyle = null;
    const extension = {
        //---------------------------------------------------------------------------------------------------------
        //                                                                                       OPCODE DEFINITIONS
        getInfo() {
            return {
                id: 'haluUILibV1',
                name: "Halu's UI Library - V1",
                docsURI: 'https://github.com/frogillius/halu-extLib/tree/main/uiLib/docs',
                blocks: [
                    {
                        opcode: 'enableOverlay',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Enable UI',
                    },
                    {
                        opcode: 'disableOverlay',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Clear UI',
                    },
                    {
                        opcode: 'setUIStyleLocation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set UI Style to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://raw.githubusercontent.com/frogillius/halu-extLib/refs/heads/main/uiLib/style.css'
                            }
                        }
                    },
                    {
                        opcode: 'setUIElement',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Create UI element with ID [ID] and type [ELEMENT] with text [VALUE] and size [SIZE]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'element1'
                            },
                            ELEMENT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'uiElements',
                                defaultValue: 'button'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello World!'
                            },
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'setElementPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Move element [ID] to x:[X] and y:[Y]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'element1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setElementSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set element [ID] size to x:[X] and y:[Y]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'element1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    }
                ],
                menus: {
                    uiElements: {
                        acceptReporters: false,
                        items: [
                            "button", "checkbox", "color", "date", "datetime-local",
                            "email", "file", "hidden", "image", "month", "number",
                            "password", "radio", "range", "reset", "search", "submit",
                            "tel", "text", "time", "url", "week"
                        ]
                    }
                }
            };
        },

        //---------------------------------------------------------------------------------------------------------
        //                                                                                          BLOCK FUNCTIONS
        enableOverlay() {
            createOverlay();
        },
        disableOverlay() {
            overlayDiv = document.getElementById("overlayDiv");
            if (overlayDiv) overlayDiv.remove();
            overlayDiv = null;
            elementArray = [];
        },
        setUIStyleLocation(args) {
            if (currentStyle) {
                currentStyle.remove();
            }

            const url = args.VALUE;

            let style = document.createElement("link");
            style.rel = "stylesheet";
            style.type = "text/css";
            style.href = url;

            style.onload = () => console.log("Stylesheet loaded successfully:", url);
            style.onerror = () => {
                console.warn("Failed to load as a stylesheet. Falling back to fetch:", url);

                fetch(url)
                    .then(response => response.text())
                    .then(css => {
                        const inlineStyle = document.createElement("style");
                        inlineStyle.textContent = css;
                        document.head.appendChild(inlineStyle);
                        currentStyle = inlineStyle;
                    })
                    .catch(error => console.error("Failed to fetch CSS:", error));
            };

            document.head.appendChild(style);
            currentStyle = style;
        },

        setUIElement(args) {
            UIManager(prepareUIObjects(args.ID, args.ELEMENT, args.VALUE, args.SIZE));
        },

        setElementSize(args) {
            scaleElement(args.ID, args.X, args.Y);
        },
        setElementPosition(args) {
            positionElement(args.ID, args.X, args.Y);
        }
    }

    //---------------------------------------------------------------------------------------------------------
    //                                                                                            API FUNCTIONS
    let elementArray = [];
    function createOverlay() {
        let overlayDiv = null;

        if (overlayDiv) overlayDiv.remove();

        const stage = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");

        if (!stage) {
            console.error("Stage not found! Verify the stage selector.");
            return;
        }

        overlayDiv = document.createElement("div");
        overlayDiv.id = "overlayDiv";
        overlayDiv.style.position = "absolute";
        overlayDiv.style.pointerEvents = "auto";
        overlayDiv.style.zIndex = "9999";
        overlayDiv.style.overflow = "hidden";
        overlayDiv.style.background = "transparent";
        overlayDiv.style.width = "100%";
        overlayDiv.style.height = "100%";

        if (stage.firstChild) {
            stage.insertBefore(overlayDiv, stage.firstChild);
        } else {
            stage.appendChild(overlayDiv);
        }
    }

    function updateOverlaySize() {
        const container = document.getElementById("overlayDiv");
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            elementArray.forEach(instance => {
                function isValidJSON(str) {
                    try {
                      JSON.parse(str);
                      return true;  // The string is a valid JSON
                    } catch (e) {
                      return false; // The string is not valid JSON
                    }
                  }
                if (!isValidJSON(instance)) return;                  
                const parsedObject = JSON.parse(instance);
                const id = parsedObject.id;
                const size = parsedObject.size;
                const targetElement = document.getElementById(id);

                if (!targetElement || targetElement.tagName !== 'INPUT') {
                    console.warn(`Element with ID "${id}" is not an <input> element.`);
                    return;
                }


                // Calculate dynamic font size based on container dimensions
                const fontSize = 0.5 * (size * Math.min(container.clientWidth * 0.1, container.clientHeight * 0.1));
                targetElement.style.fontSize = `${fontSize}px`;
            });
        });

        resizeObserver.observe(container);

        

        const stage = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp");
        if (!stage) return;

        const overlayDivs = document.querySelectorAll(".overlay");
        overlayDivs.forEach(overlayDiv => {
            overlayDiv.style.width = `${stage.clientWidth}px`;
            overlayDiv.style.height = `${stage.clientHeight}px`;
            overlayDiv.style.left = `${stage.offsetLeft}px`;
            overlayDiv.style.top = `${stage.offsetTop}px`;
        });
    }

    function UIManager(html) {
        let overlayDiv = document.getElementById("overlayDiv");
        if (!overlayDiv) {
            console.error("Overlay not enabled!");
            return;
        }

        overlayDiv.appendChild(html);
        updateOverlaySize();
    }

    function prepareUIObjects(id, type, value, size) {
        let obj = null;
        if (["button", "text", "password", "email", "search", "tel", "url", "number", "range", "date", "time", "datetime-local", "month", "week"].includes(type)) {
            obj = document.createElement("input");
            obj.id = id;
            obj.value = value;
            obj.type = type;
            obj.classList.add("halu-input-" + type);

            // Add dynamic size based on container size
            elementArray.push('{"id": "' + id + '", "size": ' + size + '}');
        } else {
            console.warn("Unsupported Option!");
            alert("Unsupported Option!");
        }

        return obj;
    }

    function positionElement(id, x, y) {
        const element = document.getElementById(id);

        if (element) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const centerX = viewportWidth / 2;
            const centerY = viewportHeight / 2;

            element.style.position = 'absolute';
            element.style.left = `${centerX + x}px`;
            element.style.top = `${centerY + y}px`;
        } else {
            console.error(`Element with id ${id} not found.`);
        }
    }

    function scaleElement(id, width, height) {
        const element = document.getElementById(id);

        if (element) {
            // Apply the new dynamic scale (width and height)
            const container = document.getElementById("overlayDiv");
            if (container) {
                const scaleFactor = Math.min(container.clientWidth / 1000, container.clientHeight / 1000);
                element.style.width = `${width * scaleFactor}px`;
                element.style.height = `${height * scaleFactor}px`;
            }
        } else {
            console.error(`Element with id ${id} not found.`);
        }
        updateOverlaySize();
    }

    Scratch.extensions.register(extension);
})(Scratch);
// WARNING: DO NOT RUN. SEVERE PERFORMANCE ISSUES
