import { bindedExposableFields } from "@/editor/EditorController";
import type { IExposable } from "../InspectorExpose";
import ExposableTransfrom from "../fields/ExposableTransform2D";
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