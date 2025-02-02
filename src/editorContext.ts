////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////

import { atom } from "nanostores";
import { type IExposableField } from "./editor/InspectorExpose";

// What component to render in inspector, usually called by IExposable.bindProperties()
export const bindedExposableFields = atom<IExposableField[]>([]);