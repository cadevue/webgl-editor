import Vector3, { type Vector3Array } from "@/lib/math/Vector3";
import NodeComponent from "@/lib/scene/component/NodeComponent";
import Mat4 from "@/lib/math/Mat4";
import Quaternion from "@/lib/math/Quaternion";
import type { IObservable } from "@/lib/interface/IObservable";

export default class Transform extends NodeComponent implements IObservable<Transform> {
    private _position: Vector3 = Vector3.zeros();
    private _rotation: Vector3 = Vector3.zeros();
    private _scale   : Vector3 = Vector3.ones();
    private _worldMatrix: Mat4 = Mat4.identity();

    constructor() {
        super();

        /** Listen to TRS changes, and recalculate world matrix */
        this._position.subscribe(() => this.calculateWorldMatrix());
        this._rotation.subscribe(() => this.calculateWorldMatrix());
        this._scale.subscribe(() => this.calculateWorldMatrix());
    }

    get position(): Vector3 { return this._position; }
    get rotation(): Vector3 { return this._rotation; }
    get scale()   : Vector3 { return this._scale; }

    set position(value: Vector3Array) { 
        this._position.x = value[0];
        this._position.y = value[1];
        this._position.z = value[2];
    }

    set rotation(value: Vector3Array) { 
        this._rotation.x = value[0];
        this._rotation.y = value[1];
        this._rotation.z = value[2];
    }

    set scale(value: Vector3Array) { 
        this._scale.x = value[0];
        this._scale.y = value[1];
        this._scale.z = value[2];
    }

    private calculateWorldMatrix(): void {
        this._worldMatrix = Mat4.compose(this._position, Quaternion.fromEuler(this._rotation), this._scale);
        this.notifyDirty();
    }

    get worldMatrix(): Mat4 {
        return this._worldMatrix;
    }

    translate(translation: Vector3): void {
        Vector3.add(this.position, translation, this.position);
    }

    rotate(rotation: Vector3): void {
        Vector3.add(this.rotation, rotation, this.rotation);
    }

    scaleBy(scale: Vector3): void {
        Vector3.multiply(this.scale, scale, this.scale);
    }

    /** Dirty State Management */
    private _dirtyListeners: Set<(observed : Transform) => void> = new Set();
    subscribe(listener: (observed : Transform) => void) { 
        this._dirtyListeners.add(listener); 
        this.notifyDirty();
    }
    notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }
}