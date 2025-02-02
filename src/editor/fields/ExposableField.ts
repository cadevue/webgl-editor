import type { FieldRenderer, FieldRendererComponent, IExposableField } from "../InspectorExpose";

export default class ExposableField<T> implements IExposableField {
    private _target: T; 
    private _rendeder: FieldRendererComponent;
    private _label: string | undefined;

    constructor(target: T, renderer: FieldRendererComponent, label?: string) {
        this._target = target;
        this._rendeder = renderer;
        this._label = label;
    }

    /** Inspector Expose */
    getFieldRenderer() : FieldRenderer {
        return { component: this._rendeder, props: { 
            target: this._target, 
            label: this._label,
        } };
    }
}