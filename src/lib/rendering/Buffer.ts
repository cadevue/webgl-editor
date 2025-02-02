import { renderContext } from "@/renderContext";
import { getSizeOfShaderDataType, shaderDataTypeToString, type ShaderDataType } from "@/lib/rendering/ShaderType";

// Delete webgl buffer when the parent object is garbage collected
const reg = new FinalizationRegistry((buffer: WebGLBuffer) => {
    const gl = renderContext.getWebGLRenderingContext();
    gl.deleteBuffer(buffer);
});

/** BUFFER ELEMENT */
export class BufferElement {
    private _name        : string;          // Name of the attribute in the shader
    private _type        : ShaderDataType;  // Type of the attribute (GL_FLOAT, GL_UNSIGNED_INT, etc)
    private _normalized  : GLboolean;       // Whether the attribute should be normalized (by default, false)
    private _size        : GLuint;          // Size of the attribute in bytes (count * SIZE_OF_TYPE[type])
    private _offset      : GLuint;          // Offset of the attribute in bytes

    constructor(name: string, type: ShaderDataType, normalized?: GLboolean) {
        this._name = name;
        this._type = type;
        this._normalized = normalized || false;
        this._size = getSizeOfShaderDataType(type);
        this._offset = 0; // Will be initialized by the buffer layout
    }

    get name()          { return this._name; }
    get type()          { return this._type; }
    get normalized()    { return this._normalized; }
    get size()          { return this._size; }
    get offset()        { return this._offset; }

    set offset(offset: GLuint) { this._offset = offset; }

    toString() {
        return `${this._name}${" ".repeat(12 - this._name.length)}(${shaderDataTypeToString(this._type)}):
            size: ${this._size}, offset: ${this._offset}`;
    }
}

/** BUFFER LAYOUT */
export class BufferLayout {
    private _elements   : BufferElement[];
    private _stride     : GLuint;

    constructor(elements: BufferElement[]) {
        this._elements  = elements;
        this._stride    = 0;
        let offset = 0;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            this._stride += element.size;

            // Compute the element offset
            element.offset = offset;
            offset += element.size;
        }
    }

    get elements() { return this._elements }
    get stride()   { return this._stride }

    toString() {
        return this._elements.map(e => e.toString()).join("\n\n").concat(`\n\nstride: ${this._stride}`);
    }
}

/** VERTEX BUFFER */
export class VertexBuffer {
    private _buffer : WebGLBuffer;
    private _layout : BufferLayout | null;

    constructor(data: Float32Array, layout?: BufferLayout) {
        const gl = renderContext.getWebGLRenderingContext();

        this._buffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        reg.register(this, this._buffer);

        this._layout = layout || null;
    }

    setLayout(layout: BufferLayout) {
        this._layout = layout;
    }

    bind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    }

    unbind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    get layout() { return this._layout; }
}

/** INDEX BUFFER */
export class IndexBuffer {
    private _buffer : WebGLBuffer;
    private _count  : number;

    constructor(data: Uint16Array) {
        const gl = renderContext.getWebGLRenderingContext();

        this._buffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

        this._count = data.length;

        reg.register(this, this._buffer);
    }

    bind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    }

    unbind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    get count() { return this._count; }
}