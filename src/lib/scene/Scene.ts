import Camera from "./camera/Camera";
import Node from "./Node";

export default class Scene {
    private _root: Node;
    private _camera: Camera;

    constructor(root: Node, camera: Camera) {
        this._root = root;
        this._camera = camera;
    }
}