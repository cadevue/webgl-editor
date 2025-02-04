import DOMUtils from "@/lib/dom/DOMUtils";
import Camera from "./Camera";
import { OrthographicCameraProjection } from "./CameraProjection";
import Input, { MouseButton } from "@/lib/input/Input";
import MathUtils from "@/lib/math/MathUtils";
import { renderContext } from "@/renderContext";
import Observable from "@/lib/math/Observable";

/** Some default camera controller provided by the engine */
export class OrthographicCameraController {
    private _camera : Camera;

    // Updated on resize
    private _aspect : number;

    // Internal
    private _zoomLevel : Observable<number> = new Observable(1);
    private _zoomSpeed : Observable<number> = new Observable(0.1);

    get zoomLevel() { return this._zoomLevel; }
    get zoomSpeed() { return this._zoomSpeed; }
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

        this._zoomLevel.subscribe(() => this.updateOrthographicProjection());
    }

    private updateOrthographicProjection() {
        const orthoProjection = this._camera.projection as OrthographicCameraProjection;
        orthoProjection.bottom = -this._zoomLevel.value;
        orthoProjection.top = this._zoomLevel.value;
        orthoProjection.left = -this._aspect * this._zoomLevel.value;
        orthoProjection.right = this._aspect * this._zoomLevel.value;
    }

    onUpdate(deltaTime : number) {
        const gl = renderContext.getWebGLRenderingContext();

        /** Zoom */
        const wheelDelta = Input.getMouseWheelDelta();
        if (wheelDelta != 0) {
            const zoomDelta = wheelDelta * deltaTime * this._zoomSpeed.value * this._zoomLevel.value;
            this._zoomLevel.value = MathUtils.clamp(this._zoomLevel.value + zoomDelta, 0.1, 10);
            this.updateOrthographicProjection();
        }

        /** Drag */
        if (Input.isMouseButtonPressed(MouseButton.Middle)) {
            DOMUtils.setCursor("grab");
            const delta = Input.getMouseDelta(); // Screen Space
            const [width, height] = [gl.canvas.width, gl.canvas.height];

            this._camera.transform.position.x -= delta.x / width * 2 * this._zoomLevel.value;
            this._camera.transform.position.y += delta.y / height * 2 * this._zoomLevel.value;
        } else {
            DOMUtils.setCursor("default");
        }
    }
}