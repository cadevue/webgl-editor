import type { Component } from "svelte";

// A node component that can be serialized 
export interface IInspectorDrawable {
    getFieldRenderer(): FieldRenderer;
}

export type FieldRendererComponent = ConstructorOfATypedSvelteComponent | Component<any, any, any>; // Svelte Component

// Field Renderer for a specific NodeComponent type
export interface FieldRenderer {
    component: FieldRendererComponent;
    props?: any; // Props to pass to the component
}
