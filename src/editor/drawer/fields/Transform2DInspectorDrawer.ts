import type Transform from "@/lib/scene/component/Transform";
import { InspectorDrawerBase } from "./InspectorDrawerBase";
import Transform2DField from "@/editor/ui/inspector/Transform2DField.svelte";

export default class Transform2DInspectorDrawer extends InspectorDrawerBase<Transform> {
    constructor(target: Transform, label?: string) {
        super(
            target,             // Value that will be exposed
            Transform2DField,   // Field renderer component
            label               // Label for the field
        );
    }
}