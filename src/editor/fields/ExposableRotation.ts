import Vector3 from "@/lib/math/Vector3";
import ExposableField from "./ExposableField";
import RotationField from "../ui/inspector/RotationField.svelte";

export default class ExposableRotation extends ExposableField<Vector3> {
    constructor(target: Vector3, label?: string) {
        super(target, RotationField, label);
    }
}