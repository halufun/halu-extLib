(function(Scratch) {
    'use strict';
    let globalScale = 1.0;
    let globalStyle = "color: var(--text-primary-default); font-family: Arial, sans-serif; margin: 5px; background-color: var(--ui-primary-default); border: 1px solid var(--ui-black-transparent-default); border-radius: calc(0.5rem / 2); padding: 10px; pointer-events: auto;";
    let containerList = null;
    const extensionIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMwMDU3OTkiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjMuNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI1Ii8+CjxwYXRoIGQ9Ik0zMiA0NEwzMiAyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTIwIDMySDQ0IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K";
    class CustomUIExtension {
        getInfo() {
            return {
                id: 'haluUIhtml',
                name: `Halu's UI`,
                color1: '#005799',
                color2: '#64B4FF',
                color3: '#64B4FF',
                menuIconURI: extensionIcon,
                blocks: [
                    {
                        func: "readme",
                        blockType: Scratch.BlockType.BUTTON,
                        text: "README"
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Management" },
                    {
                        opcode: 'setGlobalScale',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set global scale to [SCALE]',
                        arguments: {
                            SCALE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Container" },
                    {
                        opcode: 'createContainer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Create Container with ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'showUI',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Show Custom UI'
                    },
                    {
                        opcode: 'eraseContainer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Erase Container with ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'eraseAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Erase all Containers'
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Elements" },
                    {
                        opcode: 'addToContainer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Add [UI] with text [TEXT] with ID [ID] to container [CONTAINER]',
                        arguments: {
                            UI: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'UI',
                                defaultValue: 'button'
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Click me!'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-element1'
                            },
                            CONTAINER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'removeFromContainer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Remove element with ID [ID] from container [CONTAINER]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-element1'
                            },
                            CONTAINER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "States" },
                    {
                        opcode: 'whenButtonEvent',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when button [ID] from container [CONTAINER] is [TYPE]',
                        isEdgeActivated: true,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-button'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'TYPE',
                                defaultValue: 'active'
                            },
                            CONTAINER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'getInputValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get input value [ID] from container [CONTAINER]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-input'
                            },
                            CONTAINER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'isCheckboxChecked',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is checkbox [ID] from container [CONTAINER] checked?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-checkbox'
                            }
                        }
                    },
                    {
                        opcode: 'isButtonEvent',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is button [ID] from container [CONTAINER] is [TYPE]?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-button'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'TYPE',
                                defaultValue: 'hover'
                            },
                            CONTAINER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'getSliderValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get slider value [ID] from container [CONTAINER]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-slider'
                            },
                            CONTAINER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'halu-ui-container1'
                            }
                        }
                    }
                ],
                menus: {
                    TYPE: {
                        acceptReporters: false,
                        items: ["active", "hover"]
                    },
                    UI: {
                        items: ['button', 'input', 'checkbox', 'slider']
                    }
                }
            };
        }


        setGlobalScale(args) {
            globalScale = args.SCALE;
            resizeUI(document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers"));
        }

        readme() {
            alert("Please ensure all IDs called are actually present.");
        }

        createContainer(args) {
            startBackgroundListener();
            let parent = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");
            
        
            if (!containerList && parent) {
                // Create a container div for the SVG UI
                let container = document.createElement("div");
                container.setAttribute("id", "halu-ui-container");
                container.setAttribute("style", "position: absolute; top: 0; left: 0; pointer-events: none; width: 100%; height: 100%;");
        
                // Create the SVG element
                const svgNS = "http://www.w3.org/2000/svg";
                let svg = document.createElementNS(svgNS, "svg");
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                // Define a viewBox for scaling purposes (adjust as needed)
                svg.setAttribute("viewBox", `0 0 ${(Scratch.vm.runtime.stageWidth * globalScale)} ${(Scratch.vm.runtime.stageHeight * globalScale)}`);
                svg.setAttribute("style", "pointer-events: none;");
        
                // Create a foreignObject element within the SVG
                let foreignObject = document.createElementNS(svgNS, "foreignObject");
                foreignObject.setAttribute("width", "100%");
                foreignObject.setAttribute("height", "100%");
                foreignObject.setAttribute("style", "pointer-events: none;");
        
                // Create an XHTML div to hold your HTML UI
                let xhtmlDiv = document.createElement("div");
                // Set the proper namespace so browsers render the HTML correctly
                xhtmlDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
                xhtmlDiv.setAttribute("id", "xhtml-div");
                xhtmlDiv.setAttribute("style", "pointer-events: none;");
                let elements = this.getUIHTML(args);

                // Append both div and br to the parent container
                xhtmlDiv.appendChild(elements[0]);  // Append the <div>
                // xhtmlDiv.appendChild(elements[1]);  // Append the <br>
        
                // Append the XHTML content to the foreignObject
                foreignObject.appendChild(xhtmlDiv);
                // Append the foreignObject to the SVG
                svg.appendChild(foreignObject);
                // Append the SVG to the container div
                container.appendChild(svg);
        
                // Insert the container as the first child of the parent element
                parent.insertBefore(container, parent.firstChild);
        
                containerList = [args.ID];
                // Resize the UI based on the canvas scale
                resizeUI(parent);
                window.addEventListener("resize", () => resizeUI(parent));
            } else {
                let xhtmlDiv = document.getElementById('xhtml-div');
                let elements = this.getUIHTML(args);

                // Append both div and br to the parent container
                xhtmlDiv.appendChild(elements[0]);  // Append the <div>
                // xhtmlDiv.appendChild(elements[1]);  // Append the <br>
                containerList.push(String(args.ID));
            }
        }

        showUI() {
            startBackgroundListener();
            let parent = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");
            let existingUIContainer = document.getElementById("halu-ui-container");
        
            if (!existingUIContainer && parent) {
                // Create a container div for the SVG UI
                let container = document.createElement("div");
                container.setAttribute("id", "halu-ui-container");
                container.setAttribute("style", "position: absolute; top: 0; left: 0; pointer-events: none; width: 100%; height: 100%;");
        
                // Create the SVG element
                const svgNS = "http://www.w3.org/2000/svg";
                let svg = document.createElementNS(svgNS, "svg");
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                // Define a viewBox for scaling purposes (adjust as needed)
                svg.setAttribute("viewBox", `0 0 ${(Scratch.vm.runtime.stageWidth * globalScale)} ${(Scratch.vm.runtime.stageHeight * globalScale)}`);
                svg.setAttribute("style", "pointer-events: none;");
        
                // Create a foreignObject element within the SVG
                let foreignObject = document.createElementNS(svgNS, "foreignObject");
                foreignObject.setAttribute("width", "100%");
                foreignObject.setAttribute("height", "100%");
                foreignObject.setAttribute("style", "pointer-events: none;");
        
                // Create an XHTML div to hold your HTML UI
                let xhtmlDiv = document.createElement("div");
                // Set the proper namespace so browsers render the HTML correctly
                xhtmlDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
                xhtmlDiv.setAttribute("style", "pointer-events: none;");
                xhtmlDiv.innerHTML = this.getUIHTML();
        
                // Append the XHTML content to the foreignObject
                foreignObject.appendChild(xhtmlDiv);
                // Append the foreignObject to the SVG
                svg.appendChild(foreignObject);
                // Append the SVG to the container div
                container.appendChild(svg);
        
                // Insert the container as the first child of the parent element
                parent.insertBefore(container, parent.firstChild);
        
                // Resize the UI based on the canvas scale
                resizeUI(parent);
                window.addEventListener("resize", () => resizeUI(parent));
            }
        }
        
        eraseContainer(args) {
            if (!containerList) return;
            const index = containerList.indexOf(args.ID);
            if (index > -1) {
                containerList.splice(index, 1);
            }
            const container = document.getElementById(args.ID);
            const brElement = document.getElementById(args.ID + "br");
            const labelElement = document.querySelector('label[for="'+args.ID+'"]');
            if (brElement && brElement.parentNode) {
                brElement.parentNode.removeChild(brElement);
            }
            if (labelElement && labelElement.parentNode) {
                labelElement.parentNode.removeChild(labelElement);
            }
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }

        eraseAll() {
            if (!containerList) return;
            containerList.forEach(id => {
                const container = document.getElementById(id);
                const brElement = document.getElementById(id + "br");
                const labelElement = document.querySelector('label[for="'+id+'"]');
                if (brElement && brElement.parentNode) {
                    brElement.parentNode.removeChild(brElement);
                }
                if (labelElement && labelElement.parentNode) {
                    labelElement.parentNode.removeChild(labelElement);
                }
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            });
        }

        

        getUIHTML(args) {
            let div = document.createElement('div');
            div.setAttribute("id", args.ID);
            div.setAttribute("style", globalStyle);
        
            let br = document.createElement('br');
            br.setAttribute("id", args.ID + "br");
        
            // Return an object with both elements as separate nodes
            return [div, br];  // Return them as an array of nodes
        }

        addToContainer(args) {
            let container = document.getElementById(args.CONTAINER);
            if (!container) {
                console.error(`Container with ID ${args.CONTAINER} not found.`);
                return;
            }
            let defineLabel = false;
            let element = null;
            let label = null;
            if (args.UI == "button") {
                element = document.createElement("input");
                element.setAttribute("type", "button");
                element.setAttribute("id", args.ID);
                element.setAttribute("value", args.TEXT);
            } else if (args.UI == "input") {
                element = document.createElement("input");
                element.setAttribute("type", "text");
                element.setAttribute("id", args.ID);
                element.setAttribute("value", args.TEXT);
            } else if (args.UI == "checkbox") {
                element = document.createElement("input");
                element.setAttribute("type", "checkbox");
                element.setAttribute("id", args.ID);
                defineLabel = true;
                label = document.createElement("label");
                label.setAttribute("for", args.ID);
                label.innerText = args.TEXT;
            } else if (args.UI == "slider") {
                element = document.createElement("input");
                element.setAttribute("type", "range");
                element.setAttribute("id", args.ID);
                defineLabel = true;
                label = document.createElement("label");
                label.setAttribute("for", args.ID);
                label.innerText = args.TEXT;
            } else {
                console.log("Invalid UI type");
                return;
            }
            if (defineLabel) {
                container.appendChild(label);
            }
            container.appendChild(element);
            
        }

        removeFromContainer(args) {
            if (!container) {
                console.error(`Container with ID ${args.CONTAINER} not found.`);
                return;
            }
            let container = document.getElementById(args.CONTAINER);
            container.removeChild(container.querySelector('#' + args.ID));
        }
        whenButtonEvent(args) {
            console.log("checking");
            return this.buttonState(args);
        }

        // Reporter blocks to return the states of the UI elements:
        getInputValue(args) {
            const parent = document.getElementById(args.CONTAINER);
            if (!parent) {
                console.error(`Container with ID ${args.CONTAINER} not found.`);
                return '';
            }
            const inputElem = parent.querySelector('#'+args.ID);
            return inputElem ? inputElem.value : '';
        }

        isCheckboxChecked(args) {
            const parent = document.getElementById(args.CONTAINER);
            if (!parent) {
                console.error(`Container with ID ${args.CONTAINER} not found.`);
                return '';
            }
            const checkboxElem = parent.querySelector('#'+args.ID);
            return checkboxElem ? checkboxElem.checked : false;
        }

        isButtonEvent(args) {
            return this.buttonState(args);
        }

        getSliderValue(args) {
            const parent = document.getElementById(args.CONTAINER);
            if (!parent) {
                console.error(`Container with ID ${args.CONTAINER} not found.`);
                return '';
            }
            const sliderElem = parent.querySelector('#'+args.ID);
            return sliderElem ? Number(sliderElem.value) : 0;
        }
        
        buttonState(args) {
            const parent = document.getElementById(args.CONTAINER);
            if (!parent) {
                console.error(`Container with ID ${args.CONTAINER} not found.`);
                return '';
            }
            const buttonElem = parent.querySelector('#'+args.ID);
            return buttonElem ? buttonElem.matches(':' + args.TYPE) : false;
        }
    }

    function resizeUI(parent) {
        let canvas = parent.querySelector("canvas");
        let container = document.getElementById("halu-ui-container");
        
    
        if (!canvas || !container) {
            console.error("resizeUI: Missing required elements", { canvas, container });
            return;
        }
    
        
    
        // Get the stage dimensions (simulated environment size)
        let stageWidth = Scratch.vm.runtime.stageWidth;
        let stageHeight = Scratch.vm.runtime.stageHeight;
    
        // Get actual dimensions of the canvas
        container.style.width = canvas.style.width;
        container.style.height = canvas.style.height;

    
        // Get the SVG element within the container
        let svg = container.querySelector("svg");
        if (!svg) {
            console.error("resizeUI: SVG element not found inside container", { container });
            return;
        }
    
        // Set the SVG's CSS dimensions so its internal coordinate system matches the stage dimensions
        svg.setAttribute("viewBox", `0 0 ${(stageWidth * globalScale)} ${(stageHeight * globalScale)}`);


    }
    
    // Function to start listening for parent's size changes
    let resizeObserver = null;
    
    function startBackgroundListener() {
        const parent = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");
        if (!parent) {
            console.warn('Parent element not found!');
            return;
        }
    
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    
        resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === parent) {
                    resizeUI(parent);
                }
            }
        });
    
        resizeObserver.observe(parent);
    }
    
    Scratch.extensions.register(new CustomUIExtension());
})(Scratch);
