/** Shared State */
import { renderContext } from "@/renderContext";

/** Rendering */
import Camera from "@/lib/scene/camera/Camera";
import Renderer from "@/lib/rendering/Renderer";
import { Texture2D } from "@/lib/rendering/Texture";

/** Scene */
import Transform from "@/lib/scene/component/Transform";
import Primitives from "@/lib/scene/Primitives";

/** Misc */
import ShaderLibrary, { BuiltInShader } from "@/lib/asset/ShaderLibrary";
import { bindedExposableFields, editorConfig } from "@/editorContext";
import ExposableTransfrom from "@/editor/fields/ExposableTransform";
import { OrthographicCameraController } from "@/lib/scene/camera/CameraController";
import ExposableNumber from "./fields/ExposableNumber";
import type VertexArray from "@/lib/rendering/VertexArray";
import type Shader from "@/lib/rendering/Shader";
import type AppLayer from "@/lib/app/Layer";
import Application from "@/lib/app/Application";
import RenderCommand from "@/lib/rendering/RenderCommand";
import Renderer2D from "@/lib/rendering/Renderer2D";
import { ColorRGBA } from "@/lib/math/Color";

class EditorLayer implements AppLayer {
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

    constructor() {
        this._gl = renderContext.getWebGLRenderingContext();
        const gl = this._gl;

        this._texturedShader = ShaderLibrary.get(BuiltInShader.Sprite2D);
        this._texturedShader.bind();
        this._texturedShader.setInt("u_Texture", 0);

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
        this._cameraController.onUpdate(deltaTime);

        RenderCommand.setClearColor(editorConfig.viewportColor);
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

class Sandbox2DLayer implements AppLayer {
    private _gl : WebGL2RenderingContext;
    private _flatSquareTr : Transform;
    private _texturedSquareTr : Transform;

    private _moonwrTex : Texture2D;

    private _camera : Camera;
    private _cameraController : OrthographicCameraController;

    constructor() {
        this._gl = renderContext.getWebGLRenderingContext();
        const gl = this._gl;

        this._flatSquareTr = new Transform();
        this._flatSquareTr.position.set([0.55, 0, 0]);

        this._texturedSquareTr = new Transform();
        this._texturedSquareTr.position.set([-0.55, 0, 0]);
        this._moonwrTex = new Texture2D("textures/moonwr.png");

        const aspect = gl.canvas.width / gl.canvas.height;
        this._camera = Camera.createOrtographicCamera(-aspect, aspect, -1, 1, Number.MIN_VALUE, Number.MAX_VALUE);
        this._cameraController = new OrthographicCameraController(aspect, this._camera);

        this.bindProperties();
    }

    private bindProperties() {
        bindedExposableFields.set([
            new ExposableTransfrom(this._camera.transform, "Camera Transform"),
            new ExposableTransfrom(this._flatSquareTr, "Flat Square Transform"),
            new ExposableTransfrom(this._texturedSquareTr, "Textured Square Transform"),
            new ExposableNumber(this._cameraController.zoomSpeed, "Zoom Speed"),
            new ExposableNumber(this._cameraController.zoomLevel, "Zoom Level")
        ]);
    }

    onUpdate(deltaTime: number) {
        this._cameraController.onUpdate(deltaTime);

        RenderCommand.setClearColor(editorConfig.viewportColor);
        RenderCommand.clear();

        /** Draw */
        Renderer2D.beginScene(this._camera);

        Renderer2D.drawQuadFlat(this._flatSquareTr, new ColorRGBA([0.3, 0.2, 0.8, 1]));
        Renderer2D.drawQuadTextured(this._texturedSquareTr, this._moonwrTex);

        Renderer2D.endScene();
    }
}

export default class Editor extends Application {
    constructor() {
        super();
        // this.pushLayer(new EditorLayer());
        this.pushLayer(new Sandbox2DLayer());
    }
}
