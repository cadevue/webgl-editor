import Vector3 from "../math/Vector3";

export default class NodeComponent {

}

export class Transform extends NodeComponent {
    private _position: Vector3 = new Vector3();
    private _rotation: Vector3 = new Vector3();
    private _scale: Vector3 = new Vector3();

    get position(): Vector3 { return this._position; }
    get rotation(): Vector3 { return this._rotation; }
    get scale(): Vector3 { return this._scale; }

    set position(value: Vector3) { this._position = value; }
    set rotation(value: Vector3) { this._rotation = value; }
    set scale(value: Vector3) { this._scale = value; }
}

export class Mesh extends NodeComponent {

}

export class Skin extends NodeComponent {

}