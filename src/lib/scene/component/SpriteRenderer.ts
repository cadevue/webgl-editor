import { Texture2D } from "@/lib/rendering/Texture";
import Component from "../Component";
import Vector2 from "@/lib/math/Vector2";
import { ColorRGBA } from "@/lib/math/Color";
import type SceneNode from "../SceneNode";

export interface SpriteRendererProperties {
    texture?: Texture2D;
    color?: ColorRGBA;
    offset?: Vector2;
    tiling?: Vector2;
}

export default class SpriteRenderer extends Component {
    private _texture: Texture2D = Texture2D.DEFAULT_TEXTURE;
    private _color: ColorRGBA = ColorRGBA.WHITE;
    private _offset: Vector2 = Vector2.zeros();
    private _tiling: Vector2 = Vector2.ones();

    get texture(): Texture2D { return this._texture; }
    get color(): ColorRGBA { return this._color; }
    get offset(): Vector2 { return this._offset; }
    get tiling(): Vector2 { return this._tiling; }

    set texture(value: Texture2D | null) { this._texture = value ?? Texture2D.DEFAULT_TEXTURE; }
    set color(value: ColorRGBA) { this._color = value; }
    set offset(value: Vector2) { this._offset = value; }
    set tiling(value: Vector2) { this._tiling = value; }

    setProperties(props: SpriteRendererProperties) {
        if (props.texture) this.texture = props.texture;
        if (props.color) this.color = props.color;
        if (props.offset) this.offset = props.offset;
        if (props.tiling) this.tiling = props.tiling;
    }

    get properties(): SpriteRendererProperties {
        return {
            texture: this.texture,
            color: this.color,
            offset: this.offset,
            tiling: this.tiling
        };
    }

    constructor(owner: SceneNode, props: SpriteRendererProperties) {
        super(owner);
        this.setProperties(props);
    }
}