import Mat4 from "../math/Mat4";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

export default class NodeComponent { }

export class Transform extends NodeComponent {
    private _position: Vector3 = Vector3.zeros();
    private _rotation: Vector3 = Vector3.zeros();
    private _scale   : Vector3 = Vector3.ones();
    private _worldMatrix: Mat4 = Mat4.identity();
    private _dirty: boolean = true;

    get position(): Vector3 { return this._position; }
    get rotation(): Vector3 { return this._rotation; }
    get scale(): Vector3 { return this._scale; }

    set position(value: Vector3) { this._position = value; this._dirty = true; }
    set rotation(value: Vector3) { this._rotation = value; this._dirty = true; }
    set scale(value: Vector3)    { this._scale    = value; this._dirty = true; }

    private calculateWorldMatrix(): void {
        this._worldMatrix = Mat4.compose(this._position, Quaternion.fromEuler(this._rotation), this._scale);
    }

    get worldMatrix(): Mat4 {
        if (this._dirty) {
            this.calculateWorldMatrix();
            this._dirty = false;
        }

        return this._worldMatrix;
    }
}

export class Mesh extends NodeComponent {

}

export class Skin extends NodeComponent {

}