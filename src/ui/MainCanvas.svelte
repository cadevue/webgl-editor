<script lang="ts">
    import { onMount } from "svelte";
    import { renderContext } from "@/context";
    import { appConfig } from "@/config";
    import { VertexBuffer, IndexBuffer, BufferLayout, BufferElement } from "@/lib/rendering/Buffer";
    import { ShaderDataType } from "@/lib/rendering/ShaderType";
    import Shader from "@/lib/rendering/Shader";
    import DOMUtils from "@/lib/dom/DOMUtils";
    import VertexArray from "@/lib/rendering/VertexArray";
    import RenderCommand from "@/lib/rendering/RenderCommand";
    import Renderer from "@/lib/rendering/Renderer";
    import ShaderStore from "@/lib/rendering/ShaderStore";

    let canvas: HTMLCanvasElement;

    let anyColorShader : Shader | null = null;

    function initWebGL() {
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

        anyColorShader = ShaderStore.instance.getShader("2d-with-vert-color");

        const rectangle = createRectangle();

        RenderCommand.setClearColor(appConfig.viewportColor);

        function drawScene() {
            /** Render Preparation */
            // Setting up the viewport
            DOMUtils.resizeCanvasToDisplaySize(canvas);
            RenderCommand.setViewport(0, 0, gl.canvas.width, gl.canvas.height);
            RenderCommand.clear();

            /** Draw */
            Renderer.beginScene();

            anyColorShader!.bind();
            Renderer.submit(rectangle);

            Renderer.endScene();

            /** Loop */
            requestAnimationFrame(drawScene);
        }

        drawScene();
    }

    onMount(() => {
        initWebGL();
    });

    function createRectangle() {
        /** Geometry Definition */
        // Vertex Buffer
        const positions = [
            -0.5, -0.5, 0.75, 0.2, 0.1,
             0.5, -0.5, 0.75, 0.2, 0.1,
             0.5,  0.5, 0.75, 0.2, 0.1,
            -0.5,  0.5, 0.75, 0.2, 0.1
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
        const indices = [ 0, 1, 2, 2, 3, 0 ];
        const indexBuffer = new IndexBuffer(new Uint16Array(indices));

        // Vertex Array
        anyColorShader!.bind();
        const vertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        vertexArray.addVertexBuffer(vertexBuffer);
        vertexArray.setIndexBuffer(indexBuffer);

        return vertexArray;
    }
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"> 
    <canvas id="main-canvas" bind:this={canvas} class="w-full h-full"></canvas> 
</div>