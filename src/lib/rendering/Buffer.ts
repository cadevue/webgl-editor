import { glContext } from "@/context";

export class VertexBuffer {
    buffer: WebGLBuffer;

    constructor(data: Float32Array) {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot create vertex buffer");
        }

        this.buffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    bind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot bind vertex buffer");
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }

    unbind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot unbind vertex buffer");
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

export class IndexBuffer {
    buffer: WebGLBuffer;

    constructor(data: Uint16Array) {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot create index buffer");
        }

        this.buffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    bind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot bind index buffer");
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    unbind() {
        const gl = glContext.gl;
        if (!gl) {
            throw new Error("WebGL context not initialized, cannot unbind index buffer");
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}