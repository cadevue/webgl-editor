import type { IndexBuffer, VertexBuffer } from "@/lib/rendering/Buffer";
import { glContext } from "@/lib/glContext";
import { getCountOfShaderDataType, shaderDataTypeToGLType } from "@/lib/rendering/ShaderType";
import GLResourceManager from "./GLResourceManager";

/** VERTEX ARRAY */
export default class VertexArray {
    private _vertexArray : WebGLVertexArrayObject;
    private _vertexBuffers: VertexBuffer[];
    private _indexBuffer: IndexBuffer | null;

    constructor() {
        const gl = glContext.getWebGLRenderingContext();

        this._vertexArray = gl.createVertexArray();
        this._vertexBuffers = [];
        this._indexBuffer = null;

        GLResourceManager.registerResource(this, this._vertexArray);
    }

    bind() {
        const gl = glContext.getWebGLRenderingContext();
        gl.bindVertexArray(this._vertexArray);
        this._indexBuffer?.bind();
    }

    unbind() {
        const gl = glContext.getWebGLRenderingContext();
        gl.bindVertexArray(null);
        this._indexBuffer?.unbind();
    }

    addVertexBuffer(vertexBuffer: VertexBuffer) {
        if (!vertexBuffer.layout || vertexBuffer.layout.elements.length === 0) {
            console.error("Buffer layout not set or invalid, cannot add vertex buffer");
            return;
        }

        const gl = glContext.getWebGLRenderingContext();
        const shader = glContext.getActiveShader();

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
        const gl = glContext.getWebGLRenderingContext();

        gl.bindVertexArray(this._vertexArray);
        indexBuffer.bind();

        this._indexBuffer = indexBuffer
    }

    get vertexBuffers() { return this._vertexBuffers; }
    get indexBuffer() { return this._indexBuffer; }
}