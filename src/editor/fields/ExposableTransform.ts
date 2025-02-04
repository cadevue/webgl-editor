import type Transform from "@/lib/scene/component/Transform";
import ExposableField from "./ExposableField";
import TransformField from "../ui/fields/TransformField.svelte";

export default class ExposableTransfrom extends ExposableField<Transform> {
    constructor(target: Transform, label?: string) {
        super(target, TransformField, label);
    }
}