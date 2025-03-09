/** Shared State */
import { glContext } from "@/lib/glContext";

/** Rendering */
import Camera from "@/lib/scene/camera/Camera";
import { Texture2D } from "@/lib/rendering/Texture";

/** Scene */
import Transform from "@/lib/scene/component/Transform";

/** Editor */
import { EditorController } from "@/editor/EditorController";
import ExposableTransfrom2D from "@/editor/fields/ExposableTransform2D";

/** Rendering */
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
    private _quadColor : ColorRGBA = new ColorRGBA([0.25, 0.25, 0.8, 1]);

    private _camera : Camera;
    private _cameraController : OrthographicCameraController;

    constructor() {
        this._gl = glContext.getWebGLRenderingContext();
        const gl = this._gl;

        EditorController.Init();

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
        EditorController.ExposedFields.set([
            // new ExposableTransfrom2D(this._camera.transform, "Camera Transform"),
            new ExposableTransfrom2D(this._texturedSquareTr, "Textured Square Transform"),
        ]);
    }

    onUpdate(deltaTime: number) {
        this._cameraController.onUpdate(deltaTime);

        RenderCommand.setClearColor(EditorController.Config.ViewportColor);
        RenderCommand.clear();

        /** Draw */
        Renderer2D.beginScene(this._camera);

        Renderer2D.drawQuad({
            transform: this._flatSquareTr,
            color: this._quadColor,
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
