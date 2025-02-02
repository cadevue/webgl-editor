import type Transform from "@/lib/scene/component/Transform";
import TransformField from "@/ui/fields/TransformField.svelte";
import ExposableField from "./ExposableField";

export default class ExposableTransfrom extends ExposableField<Transform> {
    constructor(target: Transform) {
        super(target, TransformField);
    }
}