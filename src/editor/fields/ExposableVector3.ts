import Vector3 from "@/lib/math/Vector3";
import ExposableField from "./ExposableField";
import Vector3Field from "@/ui/fields/Vector3Field.svelte";

export default class ExposableVector3 extends ExposableField<Vector3> {
    constructor(target: Vector3) {
        super(target, Vector3Field);
    }
}