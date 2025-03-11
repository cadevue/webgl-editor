import Vector3, { type Vector3Like } from "@/lib/math/Vector3";
import Mat4 from "@/lib/math/Mat4";
import Quaternion from "@/lib/math/Quaternion";
import type { IObservable } from "@/lib/interface/IObservable";
import Component from "../Component";
import type SceneNode from "../SceneNode";

export default class Transform extends Component implements IObservable<Transform> {
    private _position: Vector3 = Vector3.zeros();
    private _rotation: Vector3 = Vector3.zeros();
    private _scale   : Vector3 = Vector3.ones();

    private _localMatrix: Mat4 = Mat4.identity();
    private _worldMatrix: Mat4 = Mat4.identity();

    private _parentWorldMatrix: Mat4 = Mat4.identity();

    constructor(owner: SceneNode) {
        super(owner);

        /** Listen to TRS changes, and recalculate world matrix */
        this._position.subscribe(() => this.calculateLocalMatrix());
        this._rotation.subscribe(() => this.calculateLocalMatrix());
        this._scale.subscribe(() => this.calculateLocalMatrix());
    }

    get position(): Vector3 { return this._position; }
    get rotation(): Vector3 { return this._rotation; }
    get scale()   : Vector3 { return this._scale; }

    set position(value: Vector3Like) {
        this._position.set(value);
    }

    set rotation(value: Vector3Like) {
        this._rotation.set(value);
    }

    set scale(value: Vector3Like) {
        this._scale.set(value);
    }

    private calculateLocalMatrix(): void {
        this._localMatrix = Mat4.compose(this._position, Quaternion.fromEuler(this._rotation), this._scale);
        this.calculateWorldMatrix(this._parentWorldMatrix);
    }

    calculateWorldMatrix(parentWorldMatrix: Mat4): void {
        this._parentWorldMatrix = parentWorldMatrix;
        this._worldMatrix = Mat4.multiply(parentWorldMatrix, this._localMatrix);
        this.notifyDirty();
    }

    get worldMatrix(): Mat4 {
        return this._worldMatrix;
    }

    translate(translation: Vector3Like): void {
        Vector3.add(this.position, translation, this.position);
        this.calculateLocalMatrix();
    }

    rotate(rotation: Vector3Like): void {
        Vector3.add(this.rotation, rotation, this.rotation);
        this.calculateLocalMatrix();
    }

    scaleBy(scale: Vector3Like): void {
        Vector3.multiply(this.scale, scale, this.scale);
        this.calculateLocalMatrix();
    }

    /** Dirty State Management */
    private _dirtyListeners: Set<(observed : Transform) => void> = new Set();
    subscribe(listener: (observed : Transform) => void) { 
        this._dirtyListeners.add(listener); 
        this.notifyDirty();
    }
    private notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }
}