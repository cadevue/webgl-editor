import Vector3 from "@/lib/math/Vector3";
import ExposableField from "./ExposableField";
import PositionField from "../ui/inspector/PositionField.svelte";

export default class ExposablePosition extends ExposableField<Vector3> {
    constructor(target: Vector3, label?: string) {
        super(target, PositionField, label);
    }
}