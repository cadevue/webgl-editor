import Vector3 from "@/lib/math/Vector3";
import { InspectorDrawerBase } from "./InspectorDrawerBase";
import PositionField from "@/editor/ui/inspector/PositionField.svelte";

export default class PositionInspectorDrawer extends InspectorDrawerBase<Vector3> {
    constructor(target: Vector3, label?: string) {
        super(target, PositionField, label);
    }
}