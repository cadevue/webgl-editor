import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "../rendering/Buffer";
import type Shader from "../rendering/Shader";
import { ShaderDataType } from "../rendering/ShaderType";
import VertexArray from "../rendering/VertexArray";

function createSquareFlat(shader: Shader) {
    /** Geometry Definition */
    // Vertex Buffer
    const positions = [
        -0.5, -0.5,
            0.5, -0.5,
            0.5,  0.5,
        -0.5,  0.5,
    ];
    const vertexBuffer = new VertexBuffer(new Float32Array(positions));

    // Vertex Buffer Layout definition
    (() => {
        const layout = new BufferLayout([
            new BufferElement("a_Position", ShaderDataType.Float2),
        ]);
        vertexBuffer.setLayout(layout);
    })();

    // Index Buffer
    const indices = [ 0, 1, 2, 2, 3, 0 ];
    const indexBuffer = new IndexBuffer(new Uint16Array(indices));

    // Vertex Array
    shader.bind();
    const vertexArray = new VertexArray();

    // Bind Vertex Array and Buffers
    vertexArray.addVertexBuffer(vertexBuffer);
    vertexArray.setIndexBuffer(indexBuffer);

    return vertexArray;
}

function createSquareTextured(shader: Shader) {
    /** Geometry Definition */
    // Vertex Buffer
    const positions = [
        -0.5, -0.5, 0.0, 0.0,
            0.5, -0.5, 1.0, 0.0,
            0.5,  0.5, 1.0, 1.0,
        -0.5,  0.5, 0.0, 1.0,
    ];
    const vertexBuffer = new VertexBuffer(new Float32Array(positions));

    // Vertex Buffer Layout definition
    (() => {
        const layout = new BufferLayout([
            new BufferElement("a_Position", ShaderDataType.Float2),
            new BufferElement("a_TexCoord", ShaderDataType.Float2),
        ]);
        vertexBuffer.setLayout(layout);
    })();

    // Index Buffer
    const indices = [ 0, 1, 2, 2, 3, 0 ];
    const indexBuffer = new IndexBuffer(new Uint16Array(indices));

    // Vertex Array
    shader.bind();
    const vertexArray = new VertexArray();

    // Bind Vertex Array and Buffers
    vertexArray.addVertexBuffer(vertexBuffer);
    vertexArray.setIndexBuffer(indexBuffer);

    return vertexArray;
}

const Primitives = {
    createSquareFlat,
    createSquareTextured,
} as const;

export default Primitives;