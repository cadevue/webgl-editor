import Mat4 from "@/lib/math/Mat4";
import type Camera from "@/lib/scene/camera/Camera";
import Transform from "@/lib/scene/component/Transform";
import RenderCommand from "@/lib/rendering/RenderCommand";
import Shader from "@/lib/rendering/Shader";
import VertexArray from "@/lib/rendering/VertexArray";
import { renderContext } from "@/renderContext";

export default class Renderer {
    private static _viewProjectionMatrix: Mat4 = Mat4.identity();

    static init() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    static beginScene(camera: Camera) { 
        this._viewProjectionMatrix = Mat4.copy(camera.viewProjectionMatrix); // To avoid inconsistencies
    }

    static submit(shader: Shader, vertexArray : VertexArray, transform?: Transform) {
        shader.bind();
        shader.setMat4("u_ViewProjection", this._viewProjectionMatrix);

        transform = transform || new Transform();
        shader.setMat4("u_Transform", transform.worldMatrix);

        vertexArray.bind();
        RenderCommand.drawIndexed(vertexArray);
    }

    static endScene() { }
}