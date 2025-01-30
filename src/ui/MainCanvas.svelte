<script lang="ts">
    import { onMount } from "svelte";
    import { renderContext } from "@/context";
    import DOMUtils from "@/lib/dom/DOMUtils";
    import Application from "@/app/Application";

    let canvas: HTMLCanvasElement;

    function startApp() {
        /** Register Canvas */
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }
        DOMUtils.initCanvas(canvas);

        /** Initialize WebGL */
        const webglRenderCtx = canvas.getContext("webgl2");
        if (!webglRenderCtx) {
            console.error("WebGL 2 is not supported");
            return;
        }
        renderContext.setWebGLRenderingContext(webglRenderCtx);

        /** Start Application */
        Application.instance.run();
    }

    onMount(() => {
        startApp();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"> 
    <canvas id="main-canvas" bind:this={canvas} class="w-full h-full"></canvas> 
</div>