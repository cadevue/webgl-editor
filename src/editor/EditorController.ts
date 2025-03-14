////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////

let isDragging = false;

function Init() {
    // Register global mouse events
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

import { atom } from "nanostores";
import { HexToColorRGBA } from "../lib/math/Color";
import DOMUtils from "@/lib/dom/DOMUtils";
import Scene from "@/lib/scene/Scene";
import SceneNode from "@/lib/scene/SceneNode";
import InspectorDrawerMap from "./drawer/InspectorDrawerMap";
import type { IInspectorDrawer } from "./drawer/fields/InspectorDrawerBase";

// Editor State
const ExposedFields = atom<IInspectorDrawer[]>([]);
const ActiveScene = atom<Scene | null>(null);
const SelectedNode = atom<SceneNode | null>(null);

ActiveScene.subscribe(scene => {
    if (scene) {
        SelectedNode.set(null);
    }
});

SelectedNode.subscribe(node => {
    if (!node) return;
    const components = node.getComponents();
    const drawers : IInspectorDrawer[] = [];
    for (const component of components) {
        const drawer = InspectorDrawerMap.get(component.constructor as any);
        if (drawer) {
            drawers.push(drawer(component));
        }
    }
    ExposedFields.set(drawers);
});

const Config = {
    ViewportColor: HexToColorRGBA("#222222"),
}


export const EditorController = {
    // properties
    Config,
    ExposedFields,
    ActiveScene,
    SelectedNode,

    // methods
    Init,
    SetDragCallback: SetDragTarget,
}