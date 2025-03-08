import type Shader from "@/lib/rendering/Shader";

type GLContext = {
    gl: WebGL2RenderingContext | null;
    activeShader: Shader | null;
}

const _glContext : GLContext = {
    gl: null,
    activeShader: null,
};

function getWebGLRenderingContext() {
    if (!_glContext.gl) {
        throw new Error("WebGL context not initialized");
    }

    return _glContext.gl;
}

function setWebGLRenderingContext(gl: WebGL2RenderingContext) {
    _glContext.gl = gl;
}

function getActiveShader() {
    if (!_glContext.activeShader) {
        throw new Error("No active shader");
    }
    return _glContext.activeShader;
}

function setActiveShader(shader: Shader | null) {
    _glContext.activeShader = shader;
}

function isInitialized() {
    return _glContext.gl !== null;
}

export const glContext = {
    getWebGLRenderingContext,
    setWebGLRenderingContext,
    getActiveShader,
    setActiveShader,
    isInitialized,
};
