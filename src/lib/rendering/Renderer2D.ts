import ShaderLibrary, { BuiltInShader } from "../asset/ShaderLibrary";
import type { ColorRGBA } from "../math/Color";
import type Camera from "../scene/camera/Camera";
import type Transform from "../scene/component/Transform";
import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "./Buffer";
import Shader from "./Shader";
import { ShaderDataType } from "./ShaderType";
import VertexArray from "./VertexArray";

export default class Renderer2D {
    private static _quadVertexArray: VertexArray;
    private static _flatColorShader: Shader;

    static init() {
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
        // shader.bind();
        Renderer2D._flatColorShader = ShaderLibrary.get(BuiltInShader.Flat2D);
        Renderer2D._flatColorShader.bind();

        Renderer2D._quadVertexArray = new VertexArray();
        // TevertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        Renderer2D._quadVertexArray.addVertexBuffer(vertexBuffer);
        Renderer2D._quadVertexArray.setIndexBuffer(indexBuffer);

    }

    static beginScene(camera: Camera) { 

    }

    static endScene() { }

    static drawQuad(transform: Transform, color: ColorRGBA) {
        // Draw a quad
    }
}