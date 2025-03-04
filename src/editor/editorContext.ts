////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////
export const editorConfig = {
    viewportColor: HexToColorRGBA("#222222"),
}

import { atom } from "nanostores";
import { type IExposableField } from "./InspectorExpose";
import { HexToColorRGBA } from "../lib/math/Color";

// What fields is in inspector, usually called by IExposable.bindProperties()
export const bindedExposableFields = atom<IExposableField[]>([]);