import type Observable from "@/lib/math/Observable";
import { InspectorDrawerBase } from "./InspectorDrawerBase";
import NumberField from "@/editor/ui/inspector/NumberField.svelte";

export default class NumberInspectorDrawer extends InspectorDrawerBase<Observable<number>> {
    constructor(target: Observable<number>, label?: string) {
        super(
            target,         // Value that will be exposed
            NumberField,    // Field renderer component
            label           // Label for the field
        );
    }
}