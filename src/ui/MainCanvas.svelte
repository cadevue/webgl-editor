<script lang="ts">
    import { onMount } from "svelte";
    import { glContext } from "../context.svelte";

    let containerWidth = 0, containerHeight = 0;

    const initWebGL = () => {
        if (!glContext.canvas) {
            console.error("Canvas not found");
            return;
        }

        glContext.gl = glContext.canvas.getContext("webgl2");
        if (!glContext.gl) {
            console.error("WebGL 2 is not supported");
            return;
        }
    }

    onMount(() => {
        initWebGL();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"
    bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}
> 
    <canvas id="main-canvas" bind:this={glContext.canvas}
        width={containerWidth} height={containerHeight}
    ></canvas>
</div>