import type Component from "./Component";
import Transform from "./component/Transform";

export default class SceneNode {
    private _children: SceneNode[] = [];
    private _parent: SceneNode | null = null;
    private _components: Component[] = [
        new Transform()
    ];

    constructor() {
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
        return this._components[0] as Transform;
    }

    addChild(child: SceneNode) {
        if (child._parent) {
            child._parent.removeChild(child);
        }

        child._parent = this;
        this._children.push(child);
        child.transform.calculateWorldMatrix(this.transform.worldMatrix);
    }

    removeChild(child: SceneNode) {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child._parent = null;
            this._children.splice(index, 1);
        }
    }

    addComponent(component: Component) {
        this._components.push(component);
    }

    getComponent<T extends Component>(type: new () => T): T | null {
        for (const component of this._components) {
            if (component instanceof type) {
                return component as T;
            }
        }

        return null;
    }

    removeComponent(component: Component) {
        const index = this._components.indexOf(component);
        if (index !== -1 && index !== 0) { // Do not remove Transform component
            this._components.splice(index, 1);
        }
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