import Mat4 from "@/lib/math/Mat4";

export abstract class CameraProjection {
    abstract getProjectionMatrix(): Mat4;
}

export class PerspectiveCameraProjection extends CameraProjection {
    private _fov: number;
    private _aspect: number;
    private _near: number;
    private _far: number;

    constructor(fov: number, aspect: number, near: number, far: number) {
        super();
        this._fov = fov;
        this._aspect = aspect;
        this._near = near;
        this._far = far;
    }

    getProjectionMatrix(): Mat4 {
        return Mat4.perspective(this._fov, this._aspect, this._near, this._far);
    }
}

export class OrthographicCameraProjection extends CameraProjection {
    private _left: number;
    private _right: number;
    private _bottom: number;
    private _top: number;
    private _near: number;
    private _far: number;

    constructor(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        super();
        this._left = left;
        this._right = right;
        this._bottom = bottom;
        this._top = top;
        this._near = near;
        this._far = far;
    }

    getProjectionMatrix(): Mat4 {
        return Mat4.orthographic(this._left, this._right, this._bottom, this._top, this._near, this._far);
    }
}