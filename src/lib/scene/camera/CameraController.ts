import DOMUtils from "@/lib/dom/DOMUtils";
import Camera from "./Camera";
import { OrthographicCameraProjection } from "./CameraProjection";
import Input from "@/lib/event/Input";
import MathUtils from "@/lib/math/MathUtils";
import { renderContext } from "@/renderContext";
import { MouseButton } from "@/lib/event/InputType";

/** Some default camera controller provided by the engine */
export class OrthographicCameraController {
    private _camera : Camera;
    private _aspect : number;
    private _zoomLevel : number = 1;

    get camera() { return this._camera; }

    constructor(aspect: number, camera?: Camera) {
        this._aspect = aspect;

        if (camera) {
            if (!(camera.projection instanceof OrthographicCameraProjection)) {
                throw new Error("OrthographicCameraController only supports OrthographicCameraProjection");
            }
        }
        
        this._camera = camera || Camera.createOrtographicCamera(-aspect, aspect, -1, 1, 0, 1);
        DOMUtils.addResizeCallback((width, height) => {
            this._aspect = width / height;
            this.updateOrthographicProjection();
        });
    }

    private updateOrthographicProjection() {
        const orthoProjection = this._camera.projection as OrthographicCameraProjection;
        orthoProjection.bottom = -this._zoomLevel;
        orthoProjection.top = this._zoomLevel;
        orthoProjection.left = -this._aspect * this._zoomLevel;
        orthoProjection.right = this._aspect * this._zoomLevel;
    }

    onUpdate(deltaTime : number) {
        const gl = renderContext.getWebGLRenderingContext();

        /** Zoom */
        const wheelDelta = Input.getMouseWheelDelta();
        if (wheelDelta != 0) {
            const zoomDelta = wheelDelta * deltaTime * 0.1 * this._zoomLevel;
            this._zoomLevel = MathUtils.clamp(this._zoomLevel + zoomDelta, 0.1, 10);
            this.updateOrthographicProjection();
        }

        /** Drag */
        if (Input.isMouseButtonPressed(MouseButton.Middle)) {
            DOMUtils.setCursor("grab");
            const delta = Input.getMouseDelta(); // Screen Space
            const [width, height] = [gl.canvas.width, gl.canvas.height];

            this._camera.transform.position.x -= delta.x / width * 2 * this._zoomLevel;
            this._camera.transform.position.y += delta.y / height * 2 * this._zoomLevel;
        } else {
            DOMUtils.setCursor("default");
        }
    }
}