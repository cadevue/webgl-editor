import ShaderLibrary, { BuiltInShader } from "../asset/ShaderLibrary";
import type { ColorRGBA } from "../math/Color";
import Mat4 from "../math/Mat4";
import type Camera from "../scene/camera/Camera";
import type Transform from "../scene/component/Transform";
import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "./Buffer";
import RenderCommand from "./RenderCommand";
import Shader from "./Shader";
import { ShaderDataType } from "./ShaderType";
import type { Texture2D } from "./Texture";
import VertexArray from "./VertexArray";

export default class Renderer2D {
    private static _quadFlatVertexArray: VertexArray;
    private static _flatColorShader: Shader;

    private static _quadTexturedVertexArray: VertexArray;
    private static _texturedShader: Shader;
    private static _viewProjectionMatrix: Mat4 = Mat4.identity();

    static init() {
        /** Geometry Definition */
        // Vertex Buffer
        let positions = [
            -0.5, -0.5,
             0.5, -0.5,
             0.5,  0.5,
            -0.5,  0.5,
        ];
        let vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Vertex Buffer Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
            ]);
            vertexBuffer.setLayout(layout);
        })();

        // Index Buffer
        let indices = [ 0, 1, 2, 2, 3, 0 ];
        let indexBuffer = new IndexBuffer(new Uint16Array(indices));

        // Vertex Array
        Renderer2D._flatColorShader = ShaderLibrary.get(BuiltInShader.Flat2D);
        Renderer2D._flatColorShader.bind();

        Renderer2D._quadFlatVertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        Renderer2D._quadFlatVertexArray.addVertexBuffer(vertexBuffer);
        Renderer2D._quadFlatVertexArray.setIndexBuffer(indexBuffer);


        //#region Textured Quad
        positions = [
            -0.5, -0.5, 0.0, 0.0,
             0.5, -0.5, 1.0, 0.0,
             0.5,  0.5, 1.0, 1.0,
            -0.5,  0.5, 0.0, 1.0,
        ];
        vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Vertex Buffer Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
                new BufferElement("a_TexCoord", ShaderDataType.Float2),
            ]);
            vertexBuffer.setLayout(layout);
        })();

        // Index Buffer
        indices = [ 0, 1, 2, 2, 3, 0 ];
        indexBuffer = new IndexBuffer(new Uint16Array(indices));

        // Vertex Array
        Renderer2D._texturedShader = ShaderLibrary.get(BuiltInShader.Textured2D);
        Renderer2D._texturedShader.bind();
        Renderer2D._texturedShader.setInt("u_Texture", 0);

        Renderer2D._quadTexturedVertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        Renderer2D._quadTexturedVertexArray.addVertexBuffer(vertexBuffer);
        Renderer2D._quadTexturedVertexArray.setIndexBuffer(indexBuffer);
    }

    static beginScene(camera: Camera) { 
        Renderer2D._viewProjectionMatrix = Mat4.copy(camera.viewProjectionMatrix); // To avoid inconsistencies

        Renderer2D._flatColorShader.bind();
        Renderer2D._flatColorShader.setMat4("u_ViewProjection", this._viewProjectionMatrix);

        Renderer2D._texturedShader.bind();
        Renderer2D._texturedShader.setMat4("u_ViewProjection", this._viewProjectionMatrix);
    }

    static drawQuadFlat(transform: Transform, color: ColorRGBA) {
        Renderer2D._flatColorShader.bind();
        Renderer2D._flatColorShader.setMat4("u_Transform", transform.worldMatrix);
        Renderer2D._flatColorShader.setFloat4("u_Color", color);

        Renderer2D._quadFlatVertexArray.bind();
        RenderCommand.drawIndexed(Renderer2D._quadFlatVertexArray);
    }

    static drawQuadTextured(transform: Transform, texture: Texture2D) {
        texture.bind();
        Renderer2D._texturedShader.bind();
        Renderer2D._texturedShader.setMat4("u_Transform", transform.worldMatrix);

        Renderer2D._quadTexturedVertexArray.bind();
        RenderCommand.drawIndexed(Renderer2D._quadTexturedVertexArray);
    }

    static endScene() {

    }

}