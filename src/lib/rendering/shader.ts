import { renderContext } from "@/context";

export default class Shader {
    private _program: WebGLProgram;

    constructor(vertexSrc: string, fragmentSrc: string) {
        const gl = renderContext.getWebGLRenderingContext();

        const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vertexShader, vertexSrc);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error("Failed to compile vertex shader: " + gl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fragmentShader, fragmentSrc);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            gl.deleteShader(vertexShader);
            throw new Error("Failed to compile fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        }

        this._program = gl.createProgram() as WebGLProgram;

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);    
            throw new Error("Failed to link shader program: " + gl.getProgramInfoLog(this._program));
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    bind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.useProgram(this._program);
        renderContext.setActiveShader(this);
    }

    unbind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.useProgram(null);
        renderContext.setActiveShader(null);
    }

    get program()   { return this._program; }
}