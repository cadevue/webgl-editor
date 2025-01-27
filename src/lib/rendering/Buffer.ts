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

class IndexBuffer {

}