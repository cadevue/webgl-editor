/** Shared State */
import { renderContext } from "@/renderContext";

/** Rendering */
import Camera from "@/lib/scene/camera/Camera";
import Renderer3D from "@/lib/rendering/Renderer3D";
import { Texture2D } from "@/lib/rendering/Texture";

/** Scene */
import Transform from "@/lib/scene/component/Transform";
import Primitives from "@/lib/scene/Primitives";

/** Editor */
import { bindedExposableFields, editorConfig } from "@/editor/editorContext";
import ExposableTransfrom from "@/editor/fields/ExposableTransform";
import ExposableNumber from "@/editor/fields/ExposableNumber";

/** Rendering */
import ShaderLibrary, { BuiltInShaderType } from "@/lib/asset/ShaderLibrary";
import type VertexArray from "@/lib/rendering/VertexArray";
import type Shader from "@/lib/rendering/Shader";
import RenderCommand from "@/lib/rendering/RenderCommand";
import Renderer2D from "@/lib/rendering/Renderer2D";
import { OrthographicCameraController } from "@/lib/scene/camera/CameraController";
import { ColorRGBA } from "@/lib/math/Color";

/** Application */
import Application from "@/lib/app/Application";
import type AppLayer from "@/lib/app/Layer";

class EditorLayer implements AppLayer {
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
        this._moonwrTex = new Texture2D({
            src: "textures/moonwr.png",
        });

        const aspect = gl.canvas.width / gl.canvas.height;
        this._camera = Camera.createOrtographicCamera(-aspect, aspect, -1, 1, Number.MIN_VALUE, Number.MAX_VALUE);
        this._cameraController = new OrthographicCameraController(aspect, this._camera);

        this.bindProperties();
    }

    private bindProperties() {
        bindedExposableFields.set([
            new ExposableTransfrom(this._camera.transform, "Camera Transform"),
        ]);
    }

    onUpdate(deltaTime: number) {
        this._cameraController.onUpdate(deltaTime);

        RenderCommand.setClearColor(editorConfig.viewportColor);
        RenderCommand.clear();

        /** Draw */
        Renderer2D.beginScene(this._camera);

        Renderer2D.drawQuad({
            transform: this._flatSquareTr,
            color: new ColorRGBA([0.25, 0.25, 0.8, 1])
        });

        Renderer2D.drawQuad({
            transform: this._texturedSquareTr,
            texture: this._moonwrTex,
        });

        Renderer2D.endScene();
    }
}

export default class EditorApplication extends Application {
    constructor(container: HTMLElement) {
        super(container);
        this.pushLayer(new EditorLayer());
    }
}
