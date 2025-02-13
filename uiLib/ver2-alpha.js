(function(Scratch) {
    'use strict';
    class CustomUIExtension {
        getInfo() {
            return {
                id: 'customUI',
                name: 'Custom UI',
                blocks: [
                    {
                        opcode: 'showUI',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Show Custom UI'
                    },
                    {
                        opcode: 'hideUI',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Hide Custom UI'
                    },
                    {
                        opcode: 'setUIBackground',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set UI background to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#333'
                            }
                        }
                    },
                    {
                        opcode: 'whenButtonEvent',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when button [ID] [TYPE]',
                        isEdgeActivated: true,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-button'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'TYPE',
                                defaultValue: 'click'
                            }
                        }
                    },
                    {
                        opcode: 'getInputValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get input value [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-input'
                            }
                        }
                    },
                    {
                        opcode: 'isCheckboxChecked',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is checkbox checked? [ID]',
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
                        text: 'is button [ID] [TYPE]?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-button'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'TYPE',
                                defaultValue: 'hover'
                            }
                        }
                    },
                    {
                        opcode: 'getSliderValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get slider value [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-slider'
                            }
                        }
                    },
                    {
                        opcode: 'getUIState',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get UI state'
                    }
                ],
                menus: {
                    TYPE: {
                        acceptReporters: false,
                        items: ["active", "hover"]
                    }
                }
            };
        }
        showUI() {
            startBackgroundListener();
            let parent = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");
            let container = document.getElementById('custom-ui-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'custom-ui-container';
                // Position and basic styling:
                container.style.position = 'fixed';
                container.style.top = '50px';
                container.style.right = '50px';
                container.style.backgroundColor = '#3338';
                container.style.color = '#fff';
                container.style.padding = '10px';
                container.style.border = '2px solid #fff';
                // container.style.zIndex = 10000;
                // Build the UI with interactive elements:
                container.innerHTML = `
                    <h3>Custom UI</h3>
                    <label>Input: <input type="text" id="custom-ui-input" value="default text"></label><br>
                    <label>Checkbox: <input type="checkbox" id="custom-ui-checkbox"></label><br>
                    <label>Slider: <input type="range" id="custom-ui-slider" min="0" max="100" value="50"></label><br>
                    <label>Button: <input type="button" id="custom-ui-button"></label><br>
                `;
                // Append as the first child:
                parent.insertBefore(container, parent.firstChild);
            }
        }
        
        hideUI() {
            const container = document.getElementById('custom-ui-container');
            if (container) {
                container.parentNode.removeChild(container);
            }
        }
        setUIBackground(args) {
            const color = args.COLOR;
            const container = document.getElementById('custom-ui-container');
            if (container) {
                container.style.backgroundColor = color;
            }
        }
        whenButtonEvent(args) {
            const result = buttonState(args);
            return result;
        }
        // Reporter blocks to return the states of the UI elements:
        getInputValue(args) {
            const inputElem = document.getElementById(args.ID);
            return inputElem ? inputElem.value : '';
        }
        isCheckboxChecked(args) {
            const checkboxElem = document.getElementById(args.ID);
            return checkboxElem ? checkboxElem.checked : false;
        }
        isButtonEvent(args) {
            return buttonState(args);
        }
        getSliderValue(args) {
            const sliderElem = document.getElementById(args.ID);
            return sliderElem ? Number(sliderElem.value) : 0;
        }
        // Returns a JSON string with all the current UI states
        getUIState() {
            const state = {
                input: this.getInputValue(),
                checkbox: this.isCheckboxChecked(),
                slider: this.getSliderValue()
            };
            return JSON.stringify(state);
        }
    }


    function buttonState(args) {
        const buttonElem = document.getElementById(args.ID);
        return buttonElem ? buttonElem.matches(':'+args.TYPE) : false;
    }

    // Function to start listening for parent's size changes
function startBackgroundListener() {
    const parent = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");
    if (!parent) {
        console.warn('Parent element not found!');
        return;
    }

    // Create a ResizeObserver to listen for size changes
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            console.log(`Parent resized to ${entry.contentRect.width} x ${entry.contentRect.height}`);
            // Run all background tasks whenever a resize is detected
            runBackgroundTasks(entry);
        }
    });

    // Start observing the parent element
    resizeObserver.observe(parent);
}


    Scratch.extensions.register(new CustomUIExtension());
})(Scratch);
