/** Shared State */
import { renderContext } from "@/renderContext";

/** Utils */
import DOMUtils from "@/lib/dom/DOMUtils";

/** Rendering */
import Camera from "@/lib/scene/camera/Camera";
import Renderer from "@/lib/rendering/Renderer";
import RenderCommand from "@/lib/rendering/RenderCommand";
import { Texture2D } from "@/lib/rendering/Texture";

/** Scene */
import Transform from "@/lib/scene/component/Transform";
import Primitives from "@/lib/scene/Primitives";

/** Input */
import Input, { KeyCode } from "@/lib/event/Input";

/** Misc */
import ShaderLibrary, { BuiltInShader } from "@/lib/asset/ShaderLibrary";
import { bindedExposableFields, editorConfig } from "@/editorContext";
import ExposableTransfrom from "@/editor/fields/ExposableTransform";
import { OrthographicCameraController } from "@/lib/scene/camera/CameraController";
import ExposableNumber from "./fields/ExposableNumber";
import type VertexArray from "@/lib/rendering/VertexArray";
import type Shader from "@/lib/rendering/Shader";
import type AppLayer from "@/lib/app/Layer";


export default class Editor implements AppLayer {
    private _gl : WebGL2RenderingContext;
    private _texturedShader : Shader;

    private _staticSquare : VertexArray;
    private _staticSquareTr : Transform;
    
    private _controllableSquare : VertexArray;
    private _controllableSquareTr : Transform;

    private _moonwrTex : Texture2D;
    private _itbTex : Texture2D;

    private _camera : Camera;
    private _cameraController : OrthographicCameraController;

    private _needResize = false;

    constructor() {
        this._gl = renderContext.getWebGLRenderingContext();
        const gl = this._gl;

        this._texturedShader = ShaderLibrary.get(BuiltInShader.Textured2D)!;
        this._texturedShader.bind();
        this._texturedShader.uploadUniformInt("u_Texture", 0);

        this._staticSquare = Primitives.createSquareTextured(this._texturedShader);
        this._staticSquareTr = new Transform();
        this._staticSquareTr.scale.set([0.8, 0.8, 1]);
        this._staticSquareTr.position.set([0.42, 0, 0]);

        this._controllableSquare = Primitives.createSquareTextured(this._texturedShader);
        this._controllableSquareTr = new Transform();
        this._controllableSquareTr.scale.set([0.8, 0.8, 1]);
        this._controllableSquareTr.position.set([-0.42, 0, 0]);

        this._moonwrTex = new Texture2D("textures/moonwr.png");
        this._itbTex = new Texture2D("textures/itb.png");

        const aspect = gl.canvas.width / gl.canvas.height;
        this._camera = Camera.createOrtographicCamera(-aspect, aspect, -1, 1, Number.MIN_VALUE, Number.MAX_VALUE);
        this._cameraController = new OrthographicCameraController(aspect, this._camera);

        this.bindProperties();
        RenderCommand.setClearColor(editorConfig.viewportColor);
    }

    private bindProperties() {
        bindedExposableFields.set([
            new ExposableTransfrom(this._controllableSquareTr, "Square Transform"),
            new ExposableTransfrom(this._camera.transform, "Camera Transform"),
            new ExposableNumber(this._cameraController.zoomSpeed, "Zoom Speed"),
            new ExposableNumber(this._cameraController.zoomLevel, "Zoom Level")
        ]);
    }

    onUpdate(deltaTime: number) {
        const moveSpeed = 1;
        const rotateSpeed = 135;

        if (Input.isKeyPressed(KeyCode.W)) {
            this._controllableSquareTr.position.y += moveSpeed * deltaTime;
        } else if (Input.isKeyPressed(KeyCode.S)) {
            this._controllableSquareTr.position.y -= moveSpeed * deltaTime;
        }

        if (Input.isKeyPressed(KeyCode.A)) {
            this._controllableSquareTr.position.x -= moveSpeed * deltaTime;
        } else if (Input.isKeyPressed(KeyCode.D)) {
            this._controllableSquareTr.position.x += moveSpeed * deltaTime
        }

        if (Input.isKeyPressed(KeyCode.Q)) {
            this._controllableSquareTr.rotation.z += rotateSpeed * deltaTime;
        } else if (Input.isKeyPressed(KeyCode.E)) {
            this._controllableSquareTr!.rotation.z -= rotateSpeed * deltaTime
        }

        this._cameraController.onUpdate(deltaTime);

        /** Render Preparation */
        // Setting up the viewport
        this._needResize = DOMUtils.resizeCanvasToDisplaySize(this._gl.canvas as HTMLCanvasElement);
        if (this._needResize) {
            RenderCommand.setViewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
        }

        RenderCommand.clear();

        /** Draw */
        Renderer.beginScene(this._camera);

        this._moonwrTex.bind();
        Renderer.submit(this._texturedShader, this._staticSquare, this._staticSquareTr);

        this._itbTex.bind();
        Renderer.submit(this._texturedShader, this._controllableSquare, this._controllableSquareTr);

        Renderer.endScene();
    }
}
