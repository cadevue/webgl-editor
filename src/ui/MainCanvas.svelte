<script lang="ts">
    import { onMount } from "svelte";
    import { renderContext } from "@/context";
    import { appConfig } from "@/config";
    import { Shader } from "@/lib/rendering/Shader";
    import { DOMUtils } from "@/lib/dom/DOMUtils";
    import { VertexBuffer, IndexBuffer, BufferLayout, BufferElement } from "@/lib/rendering/Buffer";
    import { ShaderDataType } from "@/lib/rendering/ShaderType";
    import { VertexArray } from "@/lib/rendering/VertexArray";
    import { RenderCommand } from "@/lib/rendering/RenderCommand";
    import { Renderer } from "@/lib/rendering/Renderer";

    let canvas: HTMLCanvasElement;

    let anyColorShader : Shader | null = null;
    let redShader : Shader | null = null;

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

        /** Shader Initialization */
        const anyColorVertexSource = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;

            varying vec4 v_Color;

            void main() {
                gl_Position = a_Position;
                v_Color = a_Color;
            }
        `
        const anyColorFragmentSource = `
            precision mediump float;

            varying vec4 v_Color;

            void main() {
                gl_FragColor = v_Color;
            }
        `
        anyColorShader = new Shader(anyColorVertexSource, anyColorFragmentSource);

        const redVertexSource = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;

            varying vec4 v_Color;

            void main() {
                gl_Position = a_Position;
            }
        `
        const redFragmentSource = `
            precision mediump float;

            void main() {
                gl_FragColor = vec4(0.8, 0.2, 0.1, 1.0);
            }
        `
        redShader = new Shader(redVertexSource, redFragmentSource);

        const rectangle = createRectangle();
        const triangle = createTriangle();

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

            redShader!.bind();
            Renderer.submit(triangle);

            Renderer.endScene();

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
            -0.75, -0.75, 0.1, 0.1, 0.1,
             0.75, -0.75, 0.1, 0.1, 0.1,
             0.75,  0.75, 0.1, 0.1, 0.1,
            -0.75,  0.75, 0.1, 0.1, 0.1,
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

    function createTriangle() {
        /** Geometry Definition */
        // Vertex Buffer
        const positions = [
            -0.5, -0.5,
             0.5, -0.5,
             0.0,  0.5,
        ];
        const vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Vertex Buffer Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
            ]);
            vertexBuffer.setLayout(layout);
        })();

        // Index Buffer
        const indices = [ 0, 1, 2 ];
        const indexBuffer = new IndexBuffer(new Uint16Array(indices));

        // Vertex Array
        redShader!.bind();
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