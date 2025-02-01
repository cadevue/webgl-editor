import type { Component } from "svelte";

// A Node that can be serialized (has properties that can be edited in the inspector)
export interface ISerializable {
    bindComponents(): void;
}   

// A node component that can be serialized 
export interface ISerializableField {
    getFieldRenderer(): FieldRenderer;
}

type FieldRendererComponent = ConstructorOfATypedSvelteComponent | Component<any, any, any>; // Svelte Component
// Field Renderer for a specific NodeComponent type
export interface FieldRenderer {
    component: FieldRendererComponent;
    props?: any; // Props to pass to the component
}
