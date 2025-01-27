import { renderContext } from "@/context";
import type { VertexArray } from "./VertexArray";

export class RenderCommand {
    static setClearColor(r: number, g: number, b: number, a: number) {
        const gl = renderContext.getWebGLRenderingContext();
        gl.clearColor(r, g, b, a);
    }

    static clear() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    static setViewport(x: number, y: number, width: number, height: number) {
        const gl = renderContext.getWebGLRenderingContext();
        gl.viewport(x, y, width, height);
    }

    static drawIndexed(vertexArray: VertexArray) {
        const gl = renderContext.getWebGLRenderingContext();

        if (!vertexArray.indexBuffer) {
            console.error("No index buffer set on vertex array, cannot use draw indexed");
            return;
        }

        gl.drawElements(gl.TRIANGLES, vertexArray.indexBuffer.count, gl.UNSIGNED_SHORT, 0);
    }
}