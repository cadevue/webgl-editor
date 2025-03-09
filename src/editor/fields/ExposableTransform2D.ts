import type Transform from "@/lib/scene/component/Transform";
import ExposableField from "./ExposableField";
import Transform2DField from "../ui/inspector/Transform2DField.svelte";

export default class ExposableTransfrom2D extends ExposableField<Transform> {
    constructor(target: Transform, label?: string) {
        super(
            target,             // Value that will be exposed
            Transform2DField,   // Field renderer component
            label               // Label for the field
        );
    }
}