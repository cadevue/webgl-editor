/** Shared State */
import { appConfig } from "../config";
import { renderContext } from "../context";

/** Utils */
import DOMUtils from "../lib/dom/DOMUtils";

/** Rendering */
import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "../lib/rendering/Buffer";
import { ShaderDataType } from "../lib/rendering/ShaderType";
import VertexArray from "../lib/rendering/VertexArray";
import Shader from "../lib/rendering/Shader";
import Camera from "../lib/scene/camera/Camera";
import Renderer from "../lib/rendering/Renderer";
import RenderCommand from "../lib/rendering/RenderCommand";
import Input from "@/lib/event/Input";
import { KeyCode } from "@/lib/event/InputType";

export default class Application {
    private static _instance: Application;
    private constructor() { }

    static get instance() {
        if (!Application._instance) {
            Application._instance = new Application();
        }

        return Application._instance;
    }

    run() {
       const gl = renderContext.getWebGLRenderingContext();

        const vertex = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;

            uniform mat4 u_ViewProjection;

            varying vec4 v_Color;

            void main() {
                gl_Position = u_ViewProjection * a_Position;
                v_Color = a_Color;
            }
        `;

        const fragment = `
            precision mediump float;

            varying vec4 v_Color;

            void main() {
                gl_FragColor = v_Color;
            }
        `;

        const shader = new Shader(vertex, fragment);

        const rectangle = this.createRectangle(shader);
        const camera = Camera.createOrtographicCamera();
        camera.transform.position.y -= 0.5;

        RenderCommand.setClearColor(appConfig.viewportColor);

        const camSpeed = 0.02;

        function drawScene() {
            /** Input Handling */
            if (Input.isKeyPressed(KeyCode.W)) {
                camera.transform.position.y += camSpeed;
            } else if (Input.isKeyPressed(KeyCode.S)) {
                camera.transform.position.y -= camSpeed;
            } 
            
            if (Input.isKeyPressed(KeyCode.A)) {
                camera.transform.position.x -= camSpeed;
            } else if (Input.isKeyPressed(KeyCode.D)) {
                camera.transform.position.x += camSpeed;
            }

            /** Render Preparation */
            // Setting up the viewport
            DOMUtils.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
            RenderCommand.setViewport(0, 0, gl.canvas.width, gl.canvas.height);
            RenderCommand.clear();

            /** Draw */
            Renderer.beginScene(camera);

            Renderer.submit(shader, rectangle);

            Renderer.endScene();


            /** Loop */
            requestAnimationFrame(drawScene);
        }

        drawScene();
    }

    private createRectangle(shader: Shader) {
        /** Geometry Definition */
        // Vertex Buffer
        const positions = [
            -0.5, -0.5, 0.75, 0.2, 0.1,
             0.5, -0.5, 0.75, 0.2, 0.1,
             0.5,  0.5, 0.75, 0.2, 0.1,
            -0.5,  0.5, 0.75, 0.2, 0.1
        ];
        const vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Vertex Buffer Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
                new BufferElement("a_Color"   , ShaderDataType.Float3)
            ]);
            vertexBuffer.setLayout(layout);
        })();

        // Index Buffer
        const indices = [ 0, 1, 2, 2, 3, 0 ];
        const indexBuffer = new IndexBuffer(new Uint16Array(indices));

        // Vertex Array
        shader.bind();
        const vertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        vertexArray.addVertexBuffer(vertexBuffer);
        vertexArray.setIndexBuffer(indexBuffer);

        return vertexArray;
    }
}
