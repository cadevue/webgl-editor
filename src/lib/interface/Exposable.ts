export interface IExposableOwner {
    bindProperties(): void;
}   

export interface IExposableComponent {
    label?: string; // Optional label for the component
    createInspectorField(): any;
}