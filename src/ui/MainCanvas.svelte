<script lang="ts">
    import { onMount } from "svelte";
    import { glContext as ctx } from "@/context";
    import { appConfig } from "@/config";
    import { Shader } from "@/lib/rendering/Shader";
    import { DOMUtils } from "@/lib/dom/DOMUtils";
    import { VertexBuffer, IndexBuffer, BufferLayout, BufferElement } from "@/lib/rendering/Buffer";
    import { getCountOfShaderDataType, ShaderDataType, shaderDataTypeToGLType } from "@/lib/rendering/ShaderType";

    let canvas: HTMLCanvasElement;
    const viewportColor = appConfig.viewportColor;

    const initWebGL = () => {
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }

        DOMUtils.initCanvas(canvas);

        ctx.gl = canvas.getContext("webgl2");
        if (!ctx.gl) {
            console.error("WebGL 2 is not supported");
            return;
        }

        const gl = ctx.gl;

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

        // Vertex Array
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        /** Geometry Definition */
        // Vertex Buffer
        const positions = [
            -0.5, -0.5, 1.0, 0.0, 0.0,
             0.0,  0.5, 0.0, 1.0, 0.0,
             0.5, -0.5, 0.0, 0.0, 1.0
        ];
        const vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
                new BufferElement("a_Color"   , ShaderDataType.Float3)
            ]);
            vertexBuffer.setLayout(layout);
        })();

        // Index Buffer
        const indices = [
            0, 1, 2
        ];
        const indexBuffer = new IndexBuffer(new Uint16Array(indices));

        /** Render Preparation */
        // Setting up the viewport
        DOMUtils.resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(viewportColor[0], viewportColor[1], viewportColor[2], viewportColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Vertex Buffer Attrib
        shader.bind(); // Shader to use (must correspond with the layout)
        vertexBuffer.bind();

        if (!vertexBuffer.layout) {
            console.error("Buffer layout not set");
            return;
        }

        for (let element of vertexBuffer.layout.elements) {
            let attribLoc = gl.getAttribLocation(shader.program, element.name);
            gl.enableVertexAttribArray(attribLoc);
            gl.vertexAttribPointer(
                attribLoc, 
                getCountOfShaderDataType(element.type), 
                shaderDataTypeToGLType(element.type),
                element.normalized, 
                vertexBuffer.layout.stride, 
                element.offset
            );
        }
        // const positionAttribLoc = gl.getAttribLocation(shader.program, "a_position");
        // gl.enableVertexAttribArray(positionAttribLoc);

        // let size = 2;
        // let type = gl.FLOAT;
        // let normalize = false;
        // let stride = 0;
        // let offset = 0;
        // gl.vertexAttribPointer(positionAttribLoc, size, type, normalize, stride, offset);

        /** Render */
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