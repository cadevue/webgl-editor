import type NodeComponent from "./component/NodeComponent";
import Transform from "./component/Transform";

// This is a temporary implementation. Might be changed to follow the ECS pattern in the future.
export default class Node {
    private static _idCounter: number = 0;
    private _id: number = 0;
    private _children: Node[] = [];
    private _components: NodeComponent[] = [
        new Transform()
    ]
    private _dirty: boolean = true;

    constructor() {
        this._id = Node._idCounter++;
    }

    getChildren(): Node[] { return this._children; }
    getComponents(): NodeComponent[] { return this._components; }
    getComponent<T extends NodeComponent>(type: new () => T): T | undefined {
        return this._components.find(c => c instanceof type) as T;
    }

    setDirty(): void { 
        console.log(`Node ${this._id} is dirty`);
        this._dirty = true; 
    }

    get transform(): Transform { return this.getComponent(Transform)!; }
    get isDirty(): boolean { return this._dirty; }
}