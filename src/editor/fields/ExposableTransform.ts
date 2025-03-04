import type Transform from "@/lib/scene/component/Transform";
import ExposableField from "./ExposableField";
import TransformField from "../ui/fields/TransformField.svelte";

export default class ExposableTransfrom extends ExposableField<Transform> {
    constructor(target: Transform, label?: string) {
        super(
            target,             // Value that will be exposed
            TransformField,     // Field renderer component
            label               // Label for the field
        );
    }
}