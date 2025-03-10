import SceneNode from "./SceneNode";

export default class Scene {
    private _root: SceneNode = new SceneNode();

    get root() {
        return this._root;
    }

    addNode(node: SceneNode) {
        this._root.addChild(node);
    }

    removeNode(node: SceneNode) {
        this._root.removeChild(node);
    }
}