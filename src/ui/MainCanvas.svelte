<script>
    // Canvas Size Initialization
    import { onMount } from "svelte";

    let containerWidth = 0, containerHeight = 0;
    let canvasWidth = 0, canvasHeight = 0;

    onMount(() => {
        canvasWidth = containerWidth;
        canvasHeight = containerHeight;
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"
    bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}
> 
    <canvas id="main-canvas" width={canvasWidth} height={canvasHeight}></canvas>
</div>