/** Shared State */
import { appConfig } from "@/config";
import { bindedComponents, renderContext } from "@/context";

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

        const flatColorVertex = `
            attribute vec4 a_Position;

            uniform mat4 u_ViewProjection;
            uniform mat4 u_Transform;

            varying vec2 v_TexCoord;

            void main() {
                gl_Position = u_ViewProjection * u_Transform * a_Position;
            }
        `;
        const flatColorFragment = `
            precision mediump float;

            uniform vec4 u_Color;

            void main() {
                gl_FragColor = u_Color;
            }
        `;
        const flatColorShader = new Shader(flatColorVertex, flatColorFragment);

        const texturedVertex = `
            attribute vec4 a_Position;
            attribute vec2 a_TexCoord;

            uniform mat4 u_ViewProjection;
            uniform mat4 u_Transform;

            varying vec2 v_TexCoord;

            void main() {
                gl_Position = u_ViewProjection * u_Transform * a_Position;
                v_TexCoord = a_TexCoord;
            }
        `;
        const texturedFragment = `
            precision mediump float;

            uniform sampler2D u_Texture;

            varying vec2 v_TexCoord;

            void main() {
                gl_FragColor = vec4(v_TexCoord, 0.0, 1.0);
            }
        `;
        const texturedShader = new Shader(texturedVertex, texturedFragment);

        const flatRectangle = this.createRectangleFlat(flatColorShader);
        const flatRectangleTr = new Transform();
        flatRectangleTr.scale.set([0.8, 0.8, 1]);
        flatRectangleTr.position.set([0.42, 0, 0]);

        const texturedRectangle = this.createRectangleTextured(texturedShader);
        const texturedRectangleTr = new Transform();
        texturedRectangleTr.scale.set([0.8, 0.8, 1]);
        texturedRectangleTr.position.set([-0.42, 0, 0]);

        const camera = Camera.createOrtographicCamera();

        RenderCommand.setClearColor(appConfig.viewportColor);

        bindedComponents.set([texturedRectangleTr, flatRectangleTr]);

        let deltaTime = 0;
        let previousTime = 0;

        const moveSpeed = 1;
        const rotateSpeed = 135;

        function update() {
            /** Input */
            if (Input.isKeyPressed(KeyCode.W)) {
                texturedRectangleTr.position.y += moveSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.S)) {
                texturedRectangleTr.position.y -= moveSpeed * deltaTime;
            }

            if (Input.isKeyPressed(KeyCode.A)) {
                texturedRectangleTr.position.x -= moveSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.D)) {
                texturedRectangleTr.position.x += moveSpeed * deltaTime
            }

            if (Input.isKeyPressed(KeyCode.Q)) {
                texturedRectangleTr.rotation.z += rotateSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.E)) {
                texturedRectangleTr.rotation.z -= rotateSpeed * deltaTime
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

            Renderer.submit(flatColorShader, flatRectangle, flatRectangleTr);
            flatColorShader.uploadUniformFloat4("u_Color", rectangleColor);

            Renderer.submit(texturedShader, texturedRectangle, texturedRectangleTr);

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

    private createRectangleFlat(shader: Shader) {
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

        private createRectangleTextured(shader: Shader) {
        /** Geometry Definition */
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

        // Vertex Array
        shader.bind();
        const vertexArray = new VertexArray();

        // Bind Vertex Array and Buffers
        vertexArray.addVertexBuffer(vertexBuffer);
        vertexArray.setIndexBuffer(indexBuffer);

        return vertexArray;
    }
}
