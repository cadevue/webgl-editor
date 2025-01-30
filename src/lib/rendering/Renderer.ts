import Mat4 from "../math/Mat4";
import type Camera from "../scene/camera/Camera";
import RenderCommand from "./RenderCommand";
import type Shader from "./Shader";
import VertexArray from "./VertexArray";

export default class Renderer {
    private static _viewProjectionMatrix: Mat4 = Mat4.identity();

    static beginScene(camera: Camera) { 
        this._viewProjectionMatrix = Mat4.copy(camera.viewProjectionMatrix); // To avoid inconsistencies
    }

    static submit(shader: Shader, vertexArray : VertexArray) {
        shader.bind();
        shader.uploadUniformMat4("u_ViewProjection", this._viewProjectionMatrix);

        vertexArray.bind();
        RenderCommand.drawIndexed(vertexArray);
    }

    static endScene() { }
}