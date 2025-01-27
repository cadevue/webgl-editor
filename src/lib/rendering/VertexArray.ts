import type { IndexBuffer, VertexBuffer } from "./Buffer";
import { renderContext } from "@/context";
import { getCountOfShaderDataType, shaderDataTypeToGLType } from "./ShaderType";

export class VertexArray {
    private _vertexArray : WebGLVertexArrayObject;
    private _vertexBuffers: VertexBuffer[];
    private _indexBuffer: IndexBuffer | null;

    constructor() {
        const gl = renderContext.getWebGLRenderingContext();

        this._vertexArray = gl.createVertexArray();
        this._vertexBuffers = [];
        this._indexBuffer = null;
    }

    bind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.bindVertexArray(this._vertexArray);
    }

    unbind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.bindVertexArray(null);
    }

    addVertexBuffer(vertexBuffer: VertexBuffer) {
        if (!vertexBuffer.layout || vertexBuffer.layout.elements.length === 0) {
            console.error("Buffer layout not set or invalid, cannot add vertex buffer");
            return;
        }

        const gl = renderContext.getWebGLRenderingContext();
        const shader = renderContext.getActiveShader();

        gl.bindVertexArray(this._vertexArray);
        vertexBuffer.bind();

        const layout = vertexBuffer.layout;
        for (let element of layout.elements) {
            let attribLoc = gl.getAttribLocation(shader.program, element.name);
            gl.enableVertexAttribArray(attribLoc);
            gl.vertexAttribPointer(
                attribLoc, 
                getCountOfShaderDataType(element.type), 
                shaderDataTypeToGLType(element.type),
                element.normalized, 
                layout.stride,
                element.offset
            );
        }

        this._vertexBuffers.push(vertexBuffer);
    }

    setIndexBuffer(indexBuffer: IndexBuffer) {
        const gl = renderContext.getWebGLRenderingContext();

        gl.bindVertexArray(this._vertexArray);
        indexBuffer.bind();

        this._indexBuffer = indexBuffer
    }
}