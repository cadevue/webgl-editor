import type NodeComponent from "@/lib/scene/component/NodeComponent";
import Transform from "@/lib/scene/component/Transform";

// This is a temporary implementation. Might be changed to follow the ECS pattern in the future.
export default class Node {
    private static _idCounter: number = 0;
    private _id: number = 0;
    private _children: Node[] = [];
    private _components: NodeComponent[] = [
        new Transform()
    ]

    constructor() {
        this._id = Node._idCounter++;
    }

    getChildren(): Node[] { return this._children; }
    getComponents(): NodeComponent[] { return this._components; }
    getComponent<T extends NodeComponent>(type: new () => T): T | undefined {
        return this._components.find(c => c instanceof type) as T;
    }

    get transform(): Transform { return this.getComponent(Transform)!; }
}