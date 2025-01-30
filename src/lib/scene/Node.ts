import type NodeComponent from "./NodeComponent";
import { Transform } from "./NodeComponent";

// This probably will follow the ECS Architecture, but not sure
export default class Node {
    private _children: Node[] = [];
    private _components: NodeComponent[] = [
        new Transform()
    ]

    getChildren(): Node[] { return this._children; }
    getComponents(): NodeComponent[] { return this._components; }

    getComponent<T extends NodeComponent>(type: new () => T): T | undefined {
        return this._components.find(c => c instanceof type) as T;
    }

    get transform(): Transform { return this.getComponent(Transform)!; }
}