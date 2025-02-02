/** Shared State */
import { appConfig } from "@/config";
import { bindedSerializableFields, renderContext } from "@/context";

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
import { KeyCode, MouseButton } from "@/lib/event/InputType";
import Transform from "@/lib/scene/component/Transform";
import { ColorRGBA, HexToColorRGBA } from "@/lib/math/Color";
import { Texture2D } from "@/lib/asset/Texture";
import type { OrthographicCameraProjection } from "@/lib/scene/camera/CameraProjection";
import MathUtils from "@/lib/math/MathUtils";

export default class Application {
    private static _instance: Application;

    static get instance() {
        if (!Application._instance) {
            Application._instance = new Application();
        }

        return Application._instance;
    }

    run() {
        Renderer.init();

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
                vec2 uv_Coord = vec2(v_TexCoord.x, 1.0 - v_TexCoord.y); // Handle Flip
                gl_FragColor = texture2D(u_Texture, uv_Coord);
            }
        `;
        const texturedShader = new Shader(texturedVertex, texturedFragment);
        texturedShader.uploadUniformInt("u_Texture", 0);

        // const flatSquareColor = HexToColorRGBA("#BA3A2C");

        const staticSquare = this.createSquareTextured(texturedShader);
        const staticSquareTr = new Transform();
        staticSquareTr.scale.set([0.8, 0.8, 1]);
        staticSquareTr.position.set([0.42, 0, 0]);

        const controllableSquare = this.createSquareTextured(texturedShader);
        const controllableSquareTr = new Transform();
        controllableSquareTr.scale.set([0.8, 0.8, 1]);
        controllableSquareTr.position.set([-0.42, 0, 0]);

        const moonwrTex = new Texture2D("src/assets/moonwr.png");
        const itbTex = new Texture2D("src/assets/itb.png");

        const aspect = gl.canvas.width / gl.canvas.height;
        const camera = Camera.createOrtographicCamera(-aspect, aspect, -1, 1, -Number.MAX_VALUE, Number.MAX_VALUE);
        DOMUtils.addResizeCallback((width, height) => {
            const orthoProjection = camera.projection as OrthographicCameraProjection;
            const aspect = width / height;
            orthoProjection.left = -aspect;
            orthoProjection.right = aspect;
        });

        RenderCommand.setClearColor(appConfig.viewportColor);

        bindedSerializableFields.set([controllableSquareTr, camera.transform]);

        let deltaTime = 0;
        let previousTime = 0;

        const moveSpeed = 1;
        const rotateSpeed = 135;

        function update() {
            /** Input */
            Input.beginUpdate();

            if (Input.isKeyPressed(KeyCode.W)) {
                controllableSquareTr.position.y += moveSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.S)) {
                controllableSquareTr.position.y -= moveSpeed * deltaTime;
            }

            if (Input.isKeyPressed(KeyCode.A)) {
                controllableSquareTr.position.x -= moveSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.D)) {
                controllableSquareTr.position.x += moveSpeed * deltaTime
            }

            if (Input.isKeyPressed(KeyCode.Q)) {
                controllableSquareTr.rotation.z += rotateSpeed * deltaTime;
            } else if (Input.isKeyPressed(KeyCode.E)) {
                controllableSquareTr.rotation.z -= rotateSpeed * deltaTime
            }

            const wheelDelta = Input.getMouseWheelDelta();
            const scaleDelta = wheelDelta * deltaTime * 0.1;
            camera.transform.scale.x = MathUtils.clamp(camera.transform.scale.x + scaleDelta, 0.1, 10);
            camera.transform.scale.y = MathUtils.clamp(camera.transform.scale.y + scaleDelta, 0.1, 10);

            if (Input.isMouseButtonPressed(MouseButton.Middle)) {
                DOMUtils.setCursor("grab");
                const delta = Input.getMouseDelta(); // Screen Space
                console.log(delta);
                const [width, height] = [gl.canvas.width, gl.canvas.height];
                // const aspect = width / height;

                camera.transform.position.x -= delta.x / width * 2 * camera.transform.scale.x;
                camera.transform.position.y += delta.y / height * 2 * camera.transform.scale.y;
            } else {
               DOMUtils.setCursor("default");
            }

            Input.endUpdate();
        }

        function drawScene() {
            /** Render Preparation */
            // Setting up the viewport
            DOMUtils.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
            RenderCommand.setViewport(0, 0, gl.canvas.width, gl.canvas.height);
            RenderCommand.clear();

            /** Draw */
            Renderer.beginScene(camera);

            moonwrTex.bind();
            Renderer.submit(texturedShader, staticSquare, staticSquareTr);
            // flatColorShader.uploadUniformFloat4("u_Color", flatSquareColor);

            itbTex.bind();
            Renderer.submit(texturedShader, controllableSquare, controllableSquareTr);

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

    private createSquareFlat(shader: Shader) {
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

        private createSquareTextured(shader: Shader) {
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
