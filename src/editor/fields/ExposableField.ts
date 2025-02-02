import type { FieldRenderer, FieldRendererComponent, IExposableField } from "../InspectorExpose";

export default class ExposableField<T> implements IExposableField {
    private _target: T; 
    private _rendeder: FieldRendererComponent;

    constructor(target: T, renderer: FieldRendererComponent) {
        this._target = target;
        this._rendeder = renderer;
    }

    /** Inspector Expose */
    getFieldRenderer() : FieldRenderer {
        return { component: this._rendeder, props: { target: this._target, } };
    }
}