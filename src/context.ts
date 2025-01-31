import type Shader from "@/lib/rendering/Shader";
import type Vector3 from "./lib/math/Vector3";

//////////////////////////////////
/** Rendering Specific Context **/
//////////////////////////////////
type GLContext = {
    gl: WebGL2RenderingContext | null;
    activeShader: Shader | null;
}

const _renderContext : GLContext = {
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

export const renderContext = {
    getWebGLRenderingContext,
    setWebGLRenderingContext,
    getActiveShader,
    setActiveShader,
};

////////////////////////////////////
/** Application Specific Context **/
////////////////////////////////////

import { atom } from "nanostores";
import { type IExposableComponent } from "./lib/interface/Exposable";

export const bindedProperties = atom<IExposableComponent[]>([]);