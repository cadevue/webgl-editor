import type { IObservable } from "@/lib/interface/IObservable";
import Mat4 from "@/lib/math/Mat4";

export abstract class CameraProjection implements IObservable<CameraProjection> {
    abstract getProjectionMatrix(): Mat4;
    abstract subscribe(listener: (value: CameraProjection) => void): void;
}

export class PerspectiveCameraProjection extends CameraProjection {
    private _fov: number;
    private _aspect: number;
    private _near: number;
    private _far: number;

    get fov()    { return this._fov;    }
    get aspect() { return this._aspect; }
    get near()   { return this._near;   }
    get far()    { return this._far;    }

    set fov(value: number)    { this._fov = value;    this.notifyDirty(); }
    set aspect(value: number) { this._aspect = value; this.notifyDirty(); }
    set near(value: number)   { this._near = value;   this.notifyDirty(); }
    set far(value: number)    { this._far = value;    this.notifyDirty(); }

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

    /** Dirty State Management */
    private _dirtyListeners: Set<(value: PerspectiveCameraProjection) => void> = new Set();
    subscribe(listener: (value: PerspectiveCameraProjection) => void): void {
        this._dirtyListeners.add(listener);
        this.notifyDirty();
    }
    private notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }
}

export class OrthographicCameraProjection extends CameraProjection {
    private _left: number;
    private _right: number;
    private _bottom: number;
    private _top: number;
    private _near: number;
    private _far: number;

    get left()    { return this._left;   }
    get right()   { return this._right;  }
    get bottom()  { return this._bottom; }
    get top()     { return this._top;    }
    get near()    { return this._near;   }
    get far()     { return this._far;    }

    set left(value: number)   { this._left = value;    this.notifyDirty(); }
    set right(value: number)  { this._right = value;   this.notifyDirty(); }
    set bottom(value: number) { this._bottom = value;  this.notifyDirty(); }
    set top(value: number)    { this._top = value;     this.notifyDirty(); }
    set near(value: number)   { this._near = value;    this.notifyDirty(); }
    set far(value: number)    { this._far = value;     this.notifyDirty(); }

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

    /** Dirty State Management */
    private _dirtyListeners: Set<(value: OrthographicCameraProjection) => void> = new Set();
    subscribe(listener: (value: OrthographicCameraProjection) => void): void {
        this._dirtyListeners.add(listener);
        this.notifyDirty();
    }
    private notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }
}