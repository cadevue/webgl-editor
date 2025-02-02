import type Shader from "@/lib/rendering/Shader";
import type Vector3 from "./lib/math/Vector3";

//////////////////////////////////
/** Rendering Specific Context **/
//////////////////////////////////
type GLContext = {
    initialized: boolean;
    gl: WebGL2RenderingContext | null;
    activeShader: Shader | null;
}

const _renderContext : GLContext = {
    initialized: false,
    gl: null,
    activeShader: null,
};

function getWebGLRenderingContext() {
    if (!_renderContext.gl) {
        throw new Error("WebGL context not initialized");
    }

    return _renderContext.gl;
}

function setWebGLRenderingContext(gl: WebGL2RenderingContext) {
    _renderContext.gl = gl;
    _renderContext.initialized = true;
}

function getActiveShader() {
    if (!_renderContext.activeShader) {
        throw new Error("No active shader");
    }
    return _renderContext.activeShader;
}

function setActiveShader(shader: Shader | null) {
    _renderContext.activeShader = shader;
}

function isInitialized() {
    return _renderContext.initialized;
}

export const renderContext = {
    getWebGLRenderingContext,
    setWebGLRenderingContext,
    getActiveShader,
    setActiveShader,
    isInitialized,
};

////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////

import { atom } from "nanostores";
import { type ISerializableField } from "./lib/interface/InspectorSerialization";

// What component to render in inspector, usually called by ISerializable.bindProperties()
export const bindedSerializableFields = atom<ISerializableField[]>([]);