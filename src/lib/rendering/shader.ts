import { glContext } from "@/context";

export class Shader {
    private _program: WebGLProgram;

    constructor(vertexSrc: string, fragmentSrc: string) {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot create shader");
        }

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
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot bind shader");
        }
        gl.useProgram(this._program);
    }

    unbind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot unbind shader");
        }
        gl.useProgram(null);
    }

    get program()   { return this._program; }
}