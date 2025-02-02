/** Shared State */
import { appConfig } from "@/config";
import { renderContext } from "@/renderContext";

/** Utils */
import DOMUtils from "@/lib/dom/DOMUtils";

/** Rendering */
import Camera from "@/lib/scene/camera/Camera";
import Renderer from "@/lib/rendering/Renderer";
import RenderCommand from "@/lib/rendering/RenderCommand";
import { Texture2D } from "@/lib/asset/Texture";
import type { OrthographicCameraProjection } from "@/lib/scene/camera/CameraProjection";

/** Scene */
import Transform from "@/lib/scene/component/Transform";
import Primitives from "@/lib/scene/Primitives";

/** Input */
import Input from "@/lib/event/Input";
import { KeyCode, MouseButton } from "@/lib/event/InputType";

/** Misc */
import MathUtils from "@/lib/math/MathUtils";
import ShaderLibrary, { BuiltInShader } from "@/lib/asset/ShaderLibrary";
import { bindedExposableFields } from "@/editorContext";
import ExposableTransfrom from "@/editor/fields/ExposableTransform";
import ExposableCamera from "./object/ExposableCamera";

export default class Editor {
    private static _instance: Editor;

    static get instance() {
        if (!Editor._instance) {
            Editor._instance = new Editor();
            Editor._instance.init();
        }

        return Editor._instance;
    }

    private init() {
        Renderer.init();
    }

    run() {
        const gl = renderContext.getWebGLRenderingContext();

        const texturedShader = ShaderLibrary.get(BuiltInShader.Textured2D)!;
        texturedShader.bind();
        texturedShader.uploadUniformInt("u_Texture", 0);

        const staticSquare = Primitives.createSquareTextured(texturedShader);
        const staticSquareTr = new Transform();
        staticSquareTr.scale.set([0.8, 0.8, 1]);
        staticSquareTr.position.set([0.42, 0, 0]);

        const controllableSquare = Primitives.createSquareTextured(texturedShader);
        const controllableSquareTr = new Transform();
        controllableSquareTr.scale.set([0.8, 0.8, 1]);
        controllableSquareTr.position.set([-0.42, 0, 0]);

        const moonwrTex = new Texture2D("textures/moonwr.png");
        const itbTex = new Texture2D("textures/itb.png");

        const aspect = gl.canvas.width / gl.canvas.height;
        const camera = Camera.createOrtographicCamera(-aspect, aspect, -1, 1, -Number.MAX_VALUE, Number.MAX_VALUE);
        DOMUtils.addResizeCallback((width, height) => {
            const orthoProjection = camera.projection as OrthographicCameraProjection;
            const aspect = width / height;
            orthoProjection.left = -aspect;
            orthoProjection.right = aspect;
        });

        RenderCommand.setClearColor(appConfig.viewportColor);

        bindedExposableFields.set([new ExposableTransfrom(controllableSquareTr), new ExposableTransfrom(camera.transform)]);

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
            const scaleDelta = wheelDelta * deltaTime * 0.1 * camera.transform.scale.x;
            camera.transform.scale.x = MathUtils.clamp(camera.transform.scale.x + scaleDelta, 0.1, 10);
            camera.transform.scale.y = MathUtils.clamp(camera.transform.scale.y + scaleDelta, 0.1, 10);

            if (Input.isMouseButtonPressed(MouseButton.Middle)) {
                DOMUtils.setCursor("grab");
                const delta = Input.getMouseDelta(); // Screen Space
                const [width, height] = [gl.canvas.width, gl.canvas.height];

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
}
