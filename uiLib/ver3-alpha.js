(function(Scratch) {
    'use strict';
    class CustomUIExtension {
        getInfo() {
            return {
                id: 'customUI',
                name: 'Custom UI',
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "Container" },
                    {
                        opcode: 'createContainer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '(DO NOT USE) Create Container with ID [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'custom-ui-container1'
                            }
                        }
                    },
                    {
                        opcode: 'showUI',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Show Custom UI'
                    },
                    {
                        opcode: 'eraseAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Erase all Containers'
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
            let existingIframe = document.getElementById("custom-ui-iframe");

            if (!existingIframe && parent) {
                // Create iframe container
                let iframe = document.createElement("iframe");
                iframe.setAttribute("id", "custom-ui-iframe");
                iframe.setAttribute("style", "position: absolute; top: 0; left: 0; pointer-events: auto; border: none;");
                iframe.setAttribute("srcdoc", this.getUIHTML());
                iframe.setAttribute("width", "100%");
                iframe.setAttribute("height", "100%");
                iframe.setAttribute("scrolling", "no");

                // Insert the iframe as the first child of parent
                parent.insertBefore(iframe, parent.firstChild);

                // Resize the UI based on the canvas scale
                resizeUI(parent);
                window.addEventListener("resize", () => resizeUI(parent));
            }
        }

        eraseAll() {
            const iframe = document.getElementById('custom-ui-iframe');
            if (iframe) {
                iframe.parentNode.removeChild(iframe);
            }
        }

        setUIBackground(args) {
            const color = args.COLOR;
            const iframe = document.getElementById('custom-ui-iframe');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const container = iframeDocument.getElementById('custom-ui-container');
                if (container) {
                    container.style.backgroundColor = color;
                }
            }
        }

        getUIHTML() {
            return `
            <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Windows-Style Draggable & Resizable Div</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .window {
            width: 300px;
            height: 200px;
            background: white;
            border: 2px solid black;
            position: absolute;
            top: 100px;
            left: 100px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
        }
        .title-bar {
            height: 25px;
            background: darkblue;
            color: white;
            display: flex;
            align-items: center;
            padding: 0 10px;
            font-size: 14px;
            cursor: grab;
            user-select: none;
        }
        .content {
            flex: 1;
            padding: 10px;
            overflow: auto;
        }
        /* Resizable handles */
        .resize-handle {
            position: absolute;
            background: transparent;
        }
        .resize-handle.n, .resize-handle.s {
            width: 100%;
            height: 10px;
            left: 0;
        }
        .resize-handle.n { top: -5px; cursor: ns-resize; }
        .resize-handle.s { bottom: -5px; cursor: ns-resize; }

        .resize-handle.e, .resize-handle.w {
            height: 100%;
            width: 10px;
            top: 0;
        }
        .resize-handle.e { right: -5px; cursor: ew-resize; }
        .resize-handle.w { left: -5px; cursor: ew-resize; }

        .resize-handle.nw, .resize-handle.ne, .resize-handle.sw, .resize-handle.se {
            width: 15px;
            height: 15px;
        }
        .resize-handle.nw { top: -5px; left: -5px; cursor: nwse-resize; }
        .resize-handle.ne { top: -5px; right: -5px; cursor: nesw-resize; }
        .resize-handle.sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
        .resize-handle.se { bottom: -5px; right: -5px; cursor: nwse-resize; }
        #custom-ui-container {
                                width: 100%;
                                height: 100%;
                                padding: 10px;
                            }
    </style>
</head>
<body>

<div class="window">
    <div class="title-bar">My Window</div>
    <div id="custom-ui-container">
                            <h3>Custom UI</h3>
                            <label>Input: <input type="text" id="custom-ui-input" value="default text"></label><br>
                            <label>Checkbox: <input type="checkbox" id="custom-ui-checkbox"></label><br>
                            <label>Slider: <input type="range" id="custom-ui-slider" min="0" max="100" value="50"></label><br>
                            <label>Button: <input type="button" id="custom-ui-button" value="Click Me"></label><br>
                        </div>
    <!-- Resizable handles -->
    <div class="resize-handle n"></div>
    <div class="resize-handle s"></div>
    <div class="resize-handle e"></div>
    <div class="resize-handle w"></div>
    <div class="resize-handle nw"></div>
    <div class="resize-handle ne"></div>
    <div class="resize-handle sw"></div>
    <div class="resize-handle se"></div>
</div>

<script>
    const win = document.querySelector(".window");
    const titleBar = document.querySelector(".title-bar");
    const resizeHandles = document.querySelectorAll(".resize-handle");

    let isDragging = false, isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop, currentHandle;

    // Dragging logic
    titleBar.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = win.offsetLeft;
        startTop = win.offsetTop;
        document.addEventListener("mousemove", dragWindow);
        document.addEventListener("mouseup", stopActions);
    });

    function dragWindow(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        win.style.left = startLeft + dx + "px";
        win.style.top = startTop + dy + "px";
    }

    // Resizing logic
    resizeHandles.forEach(handle => {
        handle.addEventListener("mousedown", (e) => {
            isResizing = true;
            currentHandle = e.target.classList[1];
            startX = e.clientX;
            startY = e.clientY;
            startWidth = win.offsetWidth;
            startHeight = win.offsetHeight;
            startLeft = win.offsetLeft;
            startTop = win.offsetTop;
            document.addEventListener("mousemove", resizeWindow);
            document.addEventListener("mouseup", stopActions);
            e.preventDefault();
        });
    });

    function resizeWindow(e) {
        if (!isResizing) return;

        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        if (currentHandle.includes("e")) win.style.width = startWidth + dx + "px";
        if (currentHandle.includes("s")) win.style.height = startHeight + dy + "px";
        if (currentHandle.includes("w")) {
            win.style.width = startWidth - dx + "px";
            win.style.left = startLeft + dx + "px";
        }
        if (currentHandle.includes("n")) {
            win.style.height = startHeight - dy + "px";
            win.style.top = startTop + dy + "px";
        }
    }

    function stopActions() {
        isDragging = false;
        isResizing = false;
        document.removeEventListener("mousemove", dragWindow);
        document.removeEventListener("mousemove", resizeWindow);
        document.removeEventListener("mouseup", stopActions);
    }
</script>

</body>
</html>
            `;
            
            
            return `
                <html>
                    <head>
                        <style>
                            body {
                                color: #fff;
                                font-family: Arial, sans-serif;
                                margin: 0;
                            }
                            #custom-ui-container {
                                width: 200px;
                                height: 320px;
                                background-color: #3338;
                                border: 2px solid #fff;
                                padding: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <div id="custom-ui-container">
                            <h3>Custom UI</h3>
                            <label>Input: <input type="text" id="custom-ui-input" value="default text"></label><br>
                            <label>Checkbox: <input type="checkbox" id="custom-ui-checkbox"></label><br>
                            <label>Slider: <input type="range" id="custom-ui-slider" min="0" max="100" value="50"></label><br>
                            <label>Button: <input type="button" id="custom-ui-button" value="Click Me"></label><br>
                        </div>
                    </body>
                </html>
            `;
        }

        whenButtonEvent(args) {
            return this.buttonState(args);
            
        }

        // Reporter blocks to return the states of the UI elements:
        getInputValue(args) {
            const iframe = document.getElementById('custom-ui-iframe');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const inputElem = iframeDocument.getElementById(args.ID);
                return inputElem ? inputElem.value : '';
            }
            return '';
        }

        isCheckboxChecked(args) {
            const iframe = document.getElementById('custom-ui-iframe');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const checkboxElem = iframeDocument.getElementById(args.ID);
                return checkboxElem ? checkboxElem.checked : false;
            }
            return false;
        }

        isButtonEvent(args) {
            return this.buttonState(args);
        }

        getSliderValue(args) {
            const iframe = document.getElementById('custom-ui-iframe');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const sliderElem = iframeDocument.getElementById(args.ID);
                return sliderElem ? Number(sliderElem.value) : 0;
            }
            return 0;
        }
        buttonState(args) {
            const iframe = document.getElementById('custom-ui-iframe');
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const buttonElem = iframeDocument.getElementById(args.ID);
                return buttonElem ? buttonElem.matches(':'+args.TYPE) : false;
            }
            return false;
        }

        
    }

    function resizeUI(parent) {
        let canvas = parent.querySelector("canvas");
        let iframe = document.getElementById("custom-ui-iframe");

        if (!canvas || !iframe) {
            console.error("resizeUI: Missing required elements", { canvas, iframe });
            return;
        }

        if (canvas && iframe) {
            // Get styled (CSS) canvas size
            let actualWidth = parseFloat(getComputedStyle(canvas).width);
            let actualHeight = parseFloat(getComputedStyle(canvas).height);

            // Get the stageHeight (simulated environment size)
            let stageHeight = Scratch.vm.runtime.stageHeight;
            let stageWidth = Scratch.vm.runtime.stageWidth;

            // Compute scaling factors based on the stage size and the actual canvas size
            let scaleX = actualWidth / stageWidth;
            let scaleY = actualHeight / stageHeight;

            // Set iframe dimensions to match canvas size
            iframe.setAttribute("width", actualWidth);
            iframe.setAttribute("height", actualHeight);

            // Apply CSS transform to scale all content inside the iframe
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const iframeBody = iframeDocument.body;

            // Apply scale to all content inside the iframe
            iframeBody.style.transformOrigin = "top left";
            iframeBody.style.transform = `scale(${scaleX}, ${scaleY})`;
            iframeBody.style.width = `${actualWidth / scaleX}px`; // Prevents double scaling
            iframeBody.style.height = `${actualHeight / scaleY}px`;
        }
    }

    

    // Function to start listening for parent's size changes
    let resizeObserver = null;

function startBackgroundListener() {
    const parent = document.querySelector(".stage_stage_1fD7k.box_box_2jjDp") || document.querySelector(".sc-layers");
    if (!parent) {
        console.warn('Parent element not found!');
        return;
    }

    // If there's already an observer, disconnect it
    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    // Create a new ResizeObserver and observe the parent element
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
