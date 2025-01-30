import Mat4 from "../math/Mat4";
import type Camera from "../scene/camera/Camera";
import RenderCommand from "./RenderCommand";
import VertexArray from "./VertexArray";

export default class Renderer {
    private static _viewProjectionMatrix: Mat4 = Mat4.identity();

    static beginScene(camera?: Camera) { 
        this._viewProjectionMatrix = camera ?
            camera.viewProjectionMatrix :
            Mat4.identity();
    }

    static submit(vertexArray : VertexArray) { 
        vertexArray.bind();
        RenderCommand.drawIndexed(vertexArray);
    }

    static endScene() { }
}