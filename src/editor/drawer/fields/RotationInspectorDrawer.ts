import Vector3 from "@/lib/math/Vector3";
import { InspectorDrawerBase } from "./InspectorDrawerBase";
import RotationField from "@/editor/ui/inspector/RotationField.svelte";

export default class RotationInspectorDrawer extends InspectorDrawerBase<Vector3> {
    constructor(target: Vector3, label?: string) {
        super(target, RotationField, label);
    }
}