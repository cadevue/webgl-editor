/** Shared State */
import { appConfig } from "@/config";
import { renderContext } from "@/context";

/** Utils */
import DOMUtils from "@/lib/dom/DOMUtils";

/** Rendering */
import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "@/lib/rendering/Buffer";
import { ShaderDataType } from "@/lib/rendering/ShaderType";
import VertexArray from "@/lib/rendering/VertexArray";
import Shader from "@/lib/rendering/Shader";
import Camera from "@/lib/scene/camera/Camera";
import Renderer from "@/lib/rendering/Renderer";
import RenderCommand from "@/lib/rendering/RenderCommand";
import Input from "@/lib/event/Input";
import { KeyCode } from "@/lib/event/InputType";
import Transform from "@/lib/scene/component/Transform";
import { ColorRGBA } from "@/lib/math/Color";

export default class Application {
    private static _instance: Application;

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

            uniform mat4 u_ViewProjection;
            uniform mat4 u_Transform;

            void main() {
                gl_Position = u_ViewProjection * u_Transform * a_Position;
            }
        `;

        const fragment = `
            precision mediump float;

            uniform vec4 u_Color;

            void main() {
                gl_FragColor = u_Color;
            }
        `;

        const shader = new Shader(vertex, fragment);

        const rectangle = this.createRectangle(shader);
        const rectangleTr = new Transform();

        const camera = Camera.createOrtographicCamera();

        RenderCommand.setClearColor(appConfig.viewportColor);

        let deltaTime = 0;
        let previousTime = 0;

        const moveSpeed = 1;
        const rotateSpeed = 135;

        function update() {
           /** Input */
            if (Input.isKeyPressed(KeyCode.W)) {
                rectangleTr.position.y += moveSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.S)) {
                rectangleTr.position.y -= moveSpeed * deltaTime;
            }

            if (Input.isKeyPressed(KeyCode.A)) {
                rectangleTr.position.x -= moveSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.D)) {
                rectangleTr.position.x += moveSpeed * deltaTime
            }

            if (Input.isKeyPressed(KeyCode.Q)) {
                rectangleTr.rotation.z += rotateSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.E)) {
                rectangleTr.rotation.z -= rotateSpeed * deltaTime
            }
        }

        const rectangleColor = ColorRGBA.create(0.8, 0.2, 0.2, 1);

        function drawScene() {
            /** Render Preparation */
            // Setting up the viewport
            DOMUtils.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
            RenderCommand.setViewport(0, 0, gl.canvas.width, gl.canvas.height);
            RenderCommand.clear();

            /** Draw */
            Renderer.beginScene(camera);

            Renderer.submit(shader, rectangle, rectangleTr, rectangleColor);

            Renderer.endScene();
        }        
        
        function loop(timestamp: DOMHighResTimeStamp) {
            deltaTime = (timestamp - previousTime) / 1000;
            previousTime = timestamp;

            update();
            drawScene();

            requestAnimationFrame(loop);
        }

        loop(0);
    }

    private createRectangle(shader: Shader) {
        /** Geometry Definition */
        // Vertex Buffer
        const positions = [
            -0.5, -0.5,
             0.5, -0.5,
             0.5,  0.5,
            -0.5,  0.5,
        ];
        const vertexBuffer = new VertexBuffer(new Float32Array(positions));

        // Vertex Buffer Layout definition
        (() => {
            const layout = new BufferLayout([
                new BufferElement("a_Position", ShaderDataType.Float2),
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
