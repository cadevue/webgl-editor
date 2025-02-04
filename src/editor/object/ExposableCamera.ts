import { bindedExposableFields } from "@/editor/editorContext";
import type { IExposable } from "../InspectorExpose";
import ExposableTransfrom from "../fields/ExposableTransform";
import type Camera from "@/lib/scene/camera/Camera";

export default class ExposableCamera implements IExposable {
    private _target: Camera; 

    constructor(target: Camera) {
        this._target = target;
    }

    bindComponents(): void {
        bindedExposableFields.set([
            new ExposableTransfrom(this._target.transform)
        ]);
    }

}