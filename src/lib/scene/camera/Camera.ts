import Mat4 from "@/lib/math/Mat4";
import Transform from "@/lib/scene/component/Transform";
import { OrthographicCameraProjection, type CameraProjection } from "@/lib/scene/camera/CameraProjection";
import type { ISerializable } from "@/lib/interface/InspectorSerialization";
import { bindedSerializableFields } from "@/context";

export default class Camera implements ISerializable {
    private _projection: CameraProjection;
    private _viewProjectionMatrix: Mat4 = Mat4.identity();

    // Component
    private _transform: Transform = new Transform();

    static createOrtographicCamera(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): Camera {
        // Default values for left, right, bottom, top, near, far
        left    = left      || -1;
        right   = right     ||  1;
        bottom  = bottom    || -1;
        top     = top       ||  1;
        near    = near      || -1;
        far     = far       ||  1;

        const orthoProjection = new OrthographicCameraProjection(left, right, bottom, top, near, far);
        return new Camera(orthoProjection);
    }

    constructor(projection?: CameraProjection) {
        this._projection = projection ? projection : new OrthographicCameraProjection(-1, 1, -1, 1, 0, 1);
        this._transform.subscribe(() => this.calculateViewProjectionMatrix());
    }

    private calculateViewProjectionMatrix(): void {
        const projectionMatrix = this._projection.getProjectionMatrix();
        const viewMatrix = Mat4.inverse(this._transform.worldMatrix);

        this._viewProjectionMatrix = Mat4.multiply( projectionMatrix, viewMatrix );
    }

    get projection() { return this._projection; }
    get transform()  { return this._transform ; }

    get viewProjectionMatrix(): Mat4 {
        return this._viewProjectionMatrix;
    }

    bindComponents(): void {
        bindedSerializableFields.set([this.transform]);
    }
}