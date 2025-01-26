import { glContext } from "@/context.svelte";

export class Shader {
    private program: WebGLProgram;
    private vertexSrc: string;
    private fragmentSrc: string;

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

        this.vertexSrc = vertexSrc;
        this.fragmentSrc = fragmentSrc;

        this.program = gl.createProgram() as WebGLProgram;

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);    
            throw new Error("Failed to link shader program: " + gl.getProgramInfoLog(this.program));
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    bind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot bind shader");
        }
        gl.useProgram(this.program);
    }

    unbind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot unbind shader");
        }
        gl.useProgram(null);
    }

    getProgram() { return this.program; }
    getVertexSrc() { return this.vertexSrc; }
    getFragmentSrc() { return this.fragmentSrc; }
}