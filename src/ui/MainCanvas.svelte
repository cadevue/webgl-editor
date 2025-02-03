<script lang="ts">
    import { onMount } from "svelte";
    import { renderContext } from "@/renderContext";

    import Editor from "@/editor/Editor";
    import DOMUtils from "@/lib/dom/DOMUtils";
    import Input from "@/lib/event/Input";
    import Application from "@/lib/app/Application";

    let canvas: HTMLCanvasElement;

    function startApp() {
        /** Register Canvas */
        if (!canvas) {
            console.error("Canvas not found");
            return;
        }
        DOMUtils.initCanvas(canvas);
        Input.init(canvas);

        /** Initialize WebGL */
        if (!renderContext.isInitialized()) {
            const webglRenderCtx = canvas.getContext("webgl2");
            if (!webglRenderCtx) {
                console.error("WebGL 2 is not supported");
                return;
            }
            renderContext.setWebGLRenderingContext(webglRenderCtx);
        }

        /** Start Application */
        const app = new Application();
        app.pushLayer(new Editor());
        app.run();
    }

    onMount(() => {
        startApp();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" id="main-canvas-container"> 
    <canvas id="main-canvas" bind:this={canvas} class="w-full h-full"></canvas> 
</div>