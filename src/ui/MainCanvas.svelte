<script lang="ts">
    import { onMount } from "svelte";

    let canvas : HTMLCanvasElement | null = null;
    let gl : WebGL2RenderingContext | null = null;
    let containerWidth = 0, containerHeight = 0;

    const initWebGL = () => {
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }

        gl = canvas.getContext("webgl2");
        if (!gl) {
            console.error("WebGL 2 is not supported");
            return;
        }
    }

    const resizeCanvas = () => {
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }

        canvas.width = containerWidth;
        canvas.height = containerHeight;
    }

    onMount(() => {
        resizeCanvas();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"
    bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}
> 
    <canvas id="main-canvas" bind:this={canvas}></canvas>
</div>