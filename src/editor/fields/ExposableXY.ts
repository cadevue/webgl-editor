import Vector3 from "@/lib/math/Vector3";
import ExposableField from "./ExposableField";
import XYField from "../ui/inspector/XYField.svelte";

export default class ExposableXY extends ExposableField<Vector3> {
    constructor(target: Vector3, label?: string) {
        super(target, XYField, label);
    }
}