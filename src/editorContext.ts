////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////
export const editorConfig = {
    viewportColor: HexToColorRGBA("#222222"),
}

import { atom } from "nanostores";
import { type IExposableField } from "./editor/InspectorExpose";
import { HexToColorRGBA } from "./lib/math/Color";

// What component to render in inspector, usually called by IExposable.bindProperties()
export const bindedExposableFields = atom<IExposableField[]>([]);