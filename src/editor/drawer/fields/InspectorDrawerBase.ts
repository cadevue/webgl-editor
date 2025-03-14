import type { Component } from "svelte";

// A node component that can be serialized 
export interface IInspectorDrawer {
    getFieldRenderer(): FieldRenderer;
}

export type FieldRendererComponent = ConstructorOfATypedSvelteComponent | Component<any, any, any>; // Svelte Component

// Field Renderer for a specific NodeComponent type
export interface FieldRenderer {
    component: FieldRendererComponent;
    props?: any; // Props to pass to the component
}

export class InspectorDrawerBase<T> implements IInspectorDrawer {
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