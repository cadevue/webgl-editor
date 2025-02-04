import type Observable from "@/lib/math/Observable";
import ExposableField from "./ExposableField";
import NumberField from "../ui/fields/NumberField.svelte";

export default class ExposableNumber extends ExposableField<Observable<number>> {
    constructor(target: Observable<number>, label?: string) {
        super(target, NumberField, label);
    }
}