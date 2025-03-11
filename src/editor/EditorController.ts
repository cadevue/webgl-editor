////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////

let isDragging = false;

function Init() {
    window.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            isDragging = true;
        }
    });

    window.addEventListener("mousemove", (event) => {
        if (isDragging && dragCallback !== null) {
            dragCallback(event);
        }
    });

    window.addEventListener("mouseup", (event) => {
        if (event.button === 0) {
            isDragging = false;
            dragCallback = null;
            DOMUtils.setCursor("default");
        }
    });
}

const Config = {
    ViewportColor: HexToColorRGBA("#222222"),
}

import { atom } from "nanostores";
import { type IExposableField } from "./InspectorExpose";
import { HexToColorRGBA } from "../lib/math/Color";
import DOMUtils from "@/lib/dom/DOMUtils";
import Scene from "@/lib/scene/Scene";

// What fields are exposed in the inspector
const ExposedFields = atom<IExposableField[]>([]);
const ActiveScene = atom<Scene | null>(null);

// UI Events
export type UIDragCallback = (event: MouseEvent) => void;
export interface DragTarget {
    dragCallback: UIDragCallback | null;
    cursor?: string;
}

let dragCallback: UIDragCallback | null = null;

function SetDragTarget({ dragCallback: callback, cursor }: DragTarget) {
    if (isDragging) return;

    dragCallback = callback;
    if (callback) {
        DOMUtils.setCursor(cursor || "pointer");
    } else {
        DOMUtils.setCursor("default");
    }
}

export const EditorController = {
    // properties
    Config,
    ExposedFields,
    ActiveScene,

    // methods
    Init,
    SetDragCallback: SetDragTarget,
}