import { EditorController } from "@/editor/EditorController";
import type { ComponentType } from "./Component";
import type Component from "./Component";
import Transform from "./component/Transform";

export default class SceneNode {
    private _children: SceneNode[] = [];
    private _parent: SceneNode | null = null;
    private _name: string = "";
    private _components: Map<ComponentType, Component> = new Map(
        [[Transform, new Transform(this)]]
    );

    constructor(name: string = "SceneNode") {
        this._name = name;
        this.transform.subscribe(() => 
            this._children.forEach(child => child.transform.calculateWorldMatrix(this.transform.worldMatrix))
        );
    }

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }

    get transform() {
        return this.getComponent(Transform) as Transform;
    }

    get name() {
        return this._name;
    }

    addChild(child: SceneNode) {
        if (child._parent) {
            child._parent.removeChild(child);
        }

        child._parent = this;
        this._children.unshift(child);
        child.transform.calculateWorldMatrix(this.transform.worldMatrix);
    }

    removeChild(child: SceneNode) {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child._parent = null;
            this._children.splice(index, 1);
        }
    }

    addComponent(component: ComponentType, ...args: any[]) {
        if (this._components.has(component.constructor as ComponentType)) {
            throw new Error("Component already exists");
        }

        this._components.set(component as ComponentType, new component(this, ...args));
    }

    getComponent<T extends Component>(type: new (...args : any[]) => T): T | null {
        return this._components.get(type) as T || null;
    }

    removeComponent(component: Component) {
        if (component instanceof Transform) {
            throw new Error("Cannot remove Transform component");
        }
        this._components.delete(component.constructor as ComponentType);
    }

    removeComponentByType<T extends Component>(type: new () => T) {
        const component = this.getComponent(type);
        if (component) {
            if (component instanceof Transform) {
                throw new Error("Cannot remove Transform component");
            }
            this.removeComponent(component);
        }
    }
}