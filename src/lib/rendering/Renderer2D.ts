import ShaderLibrary, { BuiltInShader } from "../asset/ShaderLibrary";
import { ColorRGBA } from "../math/Color";
import Mat4 from "../math/Mat4";
import type Camera from "../scene/camera/Camera";
import type Transform from "../scene/component/Transform";
import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "./Buffer";
import RenderCommand from "./RenderCommand";
import Shader from "./Shader";
import { ShaderDataType } from "./ShaderType";
import { Texture2D } from "./Texture";
import VertexArray from "./VertexArray";

export default class Renderer2D {
    private static _quadVertexArray: VertexArray;
    private static _spriteShader: Shader;
    private static _defaultTexture: Texture2D;

    private static _viewProjectionMatrix: Mat4 = Mat4.identity();

    static init() {
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

        Renderer2D._spriteShader = ShaderLibrary.get(BuiltInShader.Sprite2D);
        Renderer2D._spriteShader.bind();
        Renderer2D._spriteShader.setInt("u_Texture", 0);

        // Vertex Array
        Renderer2D._quadVertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        Renderer2D._quadVertexArray.addVertexBuffer(vertexBuffer);
        Renderer2D._quadVertexArray.setIndexBuffer(indexBuffer);

        Renderer2D._defaultTexture = new Texture2D("textures/white1x1.png");
    }

    static beginScene(camera: Camera) { 
        Renderer2D._viewProjectionMatrix = Mat4.copy(camera.viewProjectionMatrix); // To avoid inconsistencies

        Renderer2D._spriteShader.bind();
        Renderer2D._spriteShader.setMat4("u_ViewProjection", this._viewProjectionMatrix);
    }

    static drawQuadFlat(transform: Transform, color?: ColorRGBA) {
        Renderer2D.drawQuadTextured(transform, Renderer2D._defaultTexture, color);
    }

    static drawQuadTextured(transform: Transform, texture: Texture2D, color?: ColorRGBA) {
        texture.bind();
        color = color || ColorRGBA.WHITE;
        Renderer2D._spriteShader.bind();
        Renderer2D._spriteShader.setMat4("u_Transform", transform.worldMatrix);
        Renderer2D._spriteShader.setFloat4("u_Color", color);

        Renderer2D._quadVertexArray.bind();
        RenderCommand.drawIndexed(Renderer2D._quadVertexArray);
    }

    static endScene() {

    }

}