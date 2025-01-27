import { RenderCommand } from "./RenderCommand";
import type { VertexArray } from "./VertexArray";

export class Renderer {
    static beginScene() { }
    static endScene() { }
    static submit(vertexArray : VertexArray) { 
        vertexArray.bind();
        RenderCommand.drawIndexed(vertexArray);
    }
}