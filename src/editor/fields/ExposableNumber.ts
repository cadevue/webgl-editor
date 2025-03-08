import type Observable from "@/lib/math/Observable";
import ExposableField from "./ExposableField";
import NumberField from "../ui/inspector/NumberField.svelte";

export default class ExposableNumber extends ExposableField<Observable<number>> {
    constructor(target: Observable<number>, label?: string) {
        super(
            target,         // Value that will be exposed
            NumberField,    // Field renderer component
            label           // Label for the field
        );
    }
}