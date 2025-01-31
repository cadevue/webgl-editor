import type { Component } from "svelte";

export interface ISerializable {
    bindProperties(): void;
}   

export interface FieldRenderer {
    component: ConstructorOfATypedSvelteComponent | Component<any, any, any>;
    props?: any;
}

export interface ISerializableComponent {
    label?: string; // Optional label for the component
    createFieldRenderer(): FieldRenderer;
}