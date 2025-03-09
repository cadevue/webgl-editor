import Vector3 from "@/lib/math/Vector3";
import ExposableField from "./ExposableField";
import ZField from "../ui/inspector/ZField.svelte";

export default class ExposableZ extends ExposableField<Vector3> {
    constructor(target: Vector3, label?: string) {
        super(target, ZField, label);
    }
}