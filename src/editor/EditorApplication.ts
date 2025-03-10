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
import Scene from "@/lib/scene/Scene";
import SceneNode from "@/lib/scene/SceneNode";

class EditorLayer implements AppLayer {
    private _gl : WebGL2RenderingContext;

    private _flatSquareNode : SceneNode;
    private _texturedSquareNode : SceneNode;

    private _moonwrTex : Texture2D;
    private _quadColor : ColorRGBA = new ColorRGBA([0.25, 0.25, 0.8, 1]);

    private _camera : Camera;
    private _cameraController : OrthographicCameraController;

    private _scene : Scene;

    constructor() {
        this._gl = glContext.getWebGLRenderingContext();
        const gl = this._gl;

        EditorController.Init();

        this._scene = new Scene();

        this._texturedSquareNode = new SceneNode();
        this._texturedSquareNode.transform.position.set([-0.55, 0, 0]);
        this._scene.addNode(this._texturedSquareNode);

        this._flatSquareNode = new SceneNode();
        this._flatSquareNode.transform.position.set([0.55, 0, 0]);
        this._texturedSquareNode.addChild(this._flatSquareNode);

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
            new ExposableTransfrom2D(this._texturedSquareNode.transform, "Transform"),
        ]);
    }

    onUpdate(deltaTime: number) {
        this._cameraController.onUpdate(deltaTime);

        RenderCommand.setClearColor(EditorController.Config.ViewportColor);
        RenderCommand.clear();

        /** Draw */
        Renderer2D.beginScene(this._camera);

        Renderer2D.drawQuad({
            transform: this._flatSquareNode.transform,
            color: this._quadColor,
        });

        Renderer2D.drawQuad({
            transform: this._texturedSquareNode.transform,
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
