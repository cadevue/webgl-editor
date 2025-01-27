<script lang="ts">
    import { onMount } from "svelte";
    import { renderContext } from "@/context";
    import { appConfig } from "@/config";
    import { Shader } from "@/lib/rendering/Shader";
    import { DOMUtils } from "@/lib/dom/DOMUtils";
    import { VertexBuffer, IndexBuffer, BufferLayout, BufferElement } from "@/lib/rendering/Buffer";
    import { ShaderDataType } from "@/lib/rendering/ShaderType";
    import { VertexArray } from "@/lib/rendering/VertexArray";

    let canvas: HTMLCanvasElement;
    const viewportColor = appConfig.viewportColor;

    const initWebGL = () => {
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }

        DOMUtils.initCanvas(canvas);

        const webglRenderCtx = canvas.getContext("webgl2");
        if (!webglRenderCtx) {
            console.error("WebGL 2 is not supported");
            return;
        }

        renderContext.setWebGLRenderingContext(webglRenderCtx);
        const gl = renderContext.getWebGLRenderingContext();

        /** Shader Initialization */
        const vertexSource = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;

            varying vec4 v_Color;

            void main() {
                gl_Position = a_Position;
                v_Color = a_Color;
            }
        `
        const fragmentSource = `
            precision mediump float;

            varying vec4 v_Color;

            void main() {
                gl_FragColor = v_Color;
            }
        `
        const shader = new Shader(vertexSource, fragmentSource);

        /** Geometry Definition */
        // Vertex Buffer
        const positions = [
            -0.5, -0.5, 1.0, 0.0, 0.0,
             0.5, -0.5, 1.0, 0.1, 0.1,
             0.5,  0.5, 1.0, 0.4, 0.2,
            -0.5,  0.5, 1.0, 0.0, 0.0
        ];
        const vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Vertex Buffer Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
                new BufferElement("a_Color"   , ShaderDataType.Float3)
            ]);
            vertexBuffer.setLayout(layout);
        })();

        // Index Buffer
        const indices = [ 0, 1, 2, 0, 2, 3 ];
        const indexBuffer = new IndexBuffer(new Uint16Array(indices));

        // Vertex Array
        shader.bind(); // Needed to get the attribute locations and layout validation
        const vertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        vertexArray.addVertexBuffer(vertexBuffer);
        vertexArray.setIndexBuffer(indexBuffer);

        /** Render Preparation */
        // Setting up the viewport
        DOMUtils.resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(viewportColor[0], viewportColor[1], viewportColor[2], viewportColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Vertex Buffer Attrib
        vertexArray.bind();

        /** Draw */
        indexBuffer.bind();
        let primitiveType = gl.TRIANGLES;
        let offset = 0;
        gl.drawElements(primitiveType, indexBuffer.count, gl.UNSIGNED_SHORT, offset);
    }

    onMount(() => {
        initWebGL();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"> 
    <canvas id="main-canvas" bind:this={canvas} class="w-full h-full"></canvas> 
</div>