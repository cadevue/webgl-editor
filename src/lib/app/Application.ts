import Input from "../input/Input";
import RenderCommand from "../rendering/RenderCommand";
import Renderer3D from "../rendering/Renderer3D";
import LayerStack from "./LayerStack";
import DOMUtils from "../dom/DOMUtils";
import { renderContext } from "@/renderContext";
import type AppLayer from "./Layer";
import ShaderLibrary from "../asset/ShaderLibrary";
import Renderer2D from "../rendering/Renderer2D";

export default abstract class Application {
    private _layerStack: LayerStack = new LayerStack();

    constructor(container: HTMLElement) {
        const canvas = document.createElement("canvas");
        canvas.id = "main-canvas";
        canvas.className = "w-full h-full";

        container.appendChild(canvas);

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

        ShaderLibrary.init();
        Renderer3D.init();
        Renderer2D.init();
    }

    pushLayer(layer: AppLayer) {
        this._layerStack.pushLayer(layer);
    }

    pushOverlay(overlay: AppLayer) {
        this._layerStack.pushOverlay(overlay);
    }

    run() {
        const gl = renderContext.getWebGLRenderingContext();

        let needResize = false;
        const update = (deltaTime: number) => {
            // Window Resize Handling
            needResize = DOMUtils.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
            if (needResize) {
                RenderCommand.setViewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            // Layer Stack Processing
            Input.beginUpdate();

            for (const layer of this._layerStack.layers) {
                layer.onUpdate?.(deltaTime);
            }

            Input.endUpdate();
        }
        
        // Main Loop
        let previousTime = 0;
        let deltaTime = 0;

        function loop(timestamp: DOMHighResTimeStamp) {
            deltaTime = (timestamp - previousTime) / 1000;
            previousTime = timestamp;

            update(deltaTime);
            requestAnimationFrame(loop);
        }

        loop(0);
    }
}