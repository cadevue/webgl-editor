import ShaderLibrary, { BuiltInShaderType } from "../asset/ShaderLibrary";
import { ColorRGBA } from "../math/Color";
import Mat4 from "../math/Mat4";
import Vector2 from "../math/Vector2";
import type Camera from "../scene/camera/Camera";
import type Transform from "../scene/component/Transform";
import type AppScene from "../scene/Scene";
import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "./Buffer";
import RenderCommand from "./RenderCommand";
import Shader from "./Shader";
import { ShaderDataType } from "./ShaderType";
import { Texture2D } from "./Texture";
import VertexArray from "./VertexArray";

export interface QuadProperties {
    transform: Transform;
    texture?: Texture2D;
    color?: ColorRGBA;
    offset?: Vector2;
    tiling?: Vector2;
}

export default class Renderer2D {
    /** Rendering */
    private static _quadVertexArray: VertexArray;
    private static _spriteShader: Shader;

    /** Default Values */
    private static  _defaultTexture: Texture2D;
    private static readonly _vec2One: Vector2 = Vector2.ones();
    private static readonly _vec2Zero: Vector2 = Vector2.zeros();

    private static _viewProjectionMatrix: Mat4 = Mat4.identity();

    static init() {
        // Vertex Buffer of a Quad
        const quadPositions = [
            -0.5, -0.5, 0.0, 0.0,
             0.5, -0.5, 1.0, 0.0,
             0.5,  0.5, 1.0, 1.0,
            -0.5,  0.5, 0.0, 1.0,
        ];
        const quadVertexBuffer = new VertexBuffer(
            {
                size: quadPositions.length * Float32Array.BYTES_PER_ELEMENT,
                data: new Float32Array(quadPositions),
                layout: new BufferLayout([
                    new BufferElement("a_Position", ShaderDataType.Float2),
                    new BufferElement("a_TexCoord", ShaderDataType.Float2),
                ])
            }
        );

        // Index Buffer of a Quad
        const quadIndices = [ 0, 1, 2, 2, 3, 0 ];
        const quadIndexBuffer = new IndexBuffer(new Uint16Array(quadIndices));

        // Sprite Shader
        Renderer2D._spriteShader = ShaderLibrary.get(BuiltInShaderType.Sprite2D);
        Renderer2D._spriteShader.bind();
        Renderer2D._spriteShader.setInt("u_Texture", 0);

        // Vertex Array
        Renderer2D._quadVertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        Renderer2D._quadVertexArray.addVertexBuffer(quadVertexBuffer);
        Renderer2D._quadVertexArray.setIndexBuffer(quadIndexBuffer);

        Renderer2D._defaultTexture = new Texture2D({ width: 1, height: 1, color: ColorRGBA.WHITE })
    }

    static beginScene(camera: Camera) { 
        Renderer2D._viewProjectionMatrix = Mat4.copy(camera.viewProjectionMatrix);

        Renderer2D._spriteShader.bind();
        Renderer2D._spriteShader.setMat4("u_ViewProjection", this._viewProjectionMatrix);
    }

    static drawQuad({ transform, texture, color, offset, tiling }: QuadProperties) {
        texture = texture || Renderer2D._defaultTexture;
        texture.bind();
        color = color || ColorRGBA.WHITE;
        offset = offset || Renderer2D._vec2Zero;
        tiling = tiling || Renderer2D._vec2One;

        Renderer2D._spriteShader.bind();
        Renderer2D._spriteShader.setMat4("u_Transform", transform.worldMatrix);
        Renderer2D._spriteShader.setFloat4("u_Color", color);
        Renderer2D._spriteShader.setFloat2("u_Offset", offset);
        Renderer2D._spriteShader.setFloat2("u_Tiling", tiling);

        Renderer2D._quadVertexArray.bind();
        RenderCommand.drawIndexed(Renderer2D._quadVertexArray);
    }

    static endScene() {

    }

}