<script lang="ts">
    import { onMount } from "svelte";
    import { glContext as ctx } from "@/context";
    import { appConfig } from "@/config";
    import { Shader } from "@/lib/rendering/shader";
    import { DOMUtils } from "@/lib/dom/domUtils";

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
        const vertexSource = `
            attribute vec4 a_position;

            void main() {
                gl_Position = a_position;
            }
        `
        const fragmentSource = `
            precision mediump float;

            void main() {
                gl_FragColor = vec4(0.8, 0.2, 0.1, 1.0);
            }
        `

        const shader = new Shader(vertexSource, fragmentSource);

        const positionAttributeLocation = gl.getAttribLocation(shader.getProgram(), "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            -0.5, -0.5,
             0.0,  0.5,
             0.5, -0.5
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        DOMUtils.resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(viewportColor[0], viewportColor[1], viewportColor[2], viewportColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);

        shader.bind();
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let size = 2;
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        let primitiveType = gl.TRIANGLES;
        offset = 0;
        let count = 3;
        gl.drawArrays(primitiveType, offset, count);

        shader.unbind();
    }

    onMount(() => {
        initWebGL();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"> 
    <canvas id="main-canvas" bind:this={canvas} class="w-full h-full"></canvas> 
</div>