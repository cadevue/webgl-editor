import type SceneNode from "./SceneNode";

export default abstract class Component {
    private _owner: SceneNode;

    constructor(owner: SceneNode) {
        this._owner = owner;
    }

    protected getComponent<T extends Component>(type: new (...args: any[]) => T): T | null {
        return this._owner.getComponent(type);
    }
};

export type ComponentType = new (...args: any[]) => Component;
