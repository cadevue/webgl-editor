import type { Component } from "svelte";

export interface ISerializable {
    bindProperties(): void;
}   

export interface FieldRenderer {
    component: ConstructorOfATypedSvelteComponent | Component<any, any, any>;
    props?: any;
}

export interface ISerializableComponent {
    getFieldRenderer(): FieldRenderer;
}