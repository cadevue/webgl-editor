import RenderCommand from "./RenderCommand";
import VertexArray from "./VertexArray";

export default class Renderer {
    static beginScene() { }
    static endScene() { }
    static submit(vertexArray : VertexArray) { 
        vertexArray.bind();
        RenderCommand.drawIndexed(vertexArray);
    }
}