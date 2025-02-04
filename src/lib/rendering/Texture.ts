import { renderContext } from "@/renderContext";
import GLMemory from "./GLMemory";
import { ColorRGBA } from "../math/Color";

export interface TextureCreateParams {
    width?: number;
    height?: number;
    color?: ColorRGBA;
    src?: string;
}

export abstract class Texture {
    public abstract get width(): number;
    public abstract get height(): number;
    public abstract bind(slot?: number): void;
}

export type TextureSlot = 
    WebGLRenderingContextBase['TEXTURE0'] | WebGLRenderingContextBase['TEXTURE1'] | WebGLRenderingContextBase['TEXTURE2'] |
    WebGLRenderingContextBase['TEXTURE3'] | WebGLRenderingContextBase['TEXTURE4'] | WebGLRenderingContextBase['TEXTURE5'] |
    WebGLRenderingContextBase['TEXTURE6'] | WebGLRenderingContextBase['TEXTURE7']

export class Texture2D extends Texture {
    private _texture: WebGLTexture;
    private _width: number;
    private _height: number;

    private _path: string;

    get width(): number { return this._width; }
    get height(): number { return this._height; }

    public constructor({ width, height, color, src: path } : TextureCreateParams) {
        super();
        this._width  = width || 0;
        this._height = height || 0;
        // this._path   = path;

        const gl = renderContext.getWebGLRenderingContext();

        if (!path) {
            if (!color) {
                console.warn("Creating a texture without a path or color will default to a 1x1 pixel magenta color");
                color = ColorRGBA.MAGENTA;
            }

            this._texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(color.toArrayDenormalized()));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            this._path = "";
        } else {
            // Create a texture and set it to a 1x1 pixel magenta color
            this._path = path;
            this._texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            // Load the texture image
            const image = new Image();
            image.src = path;
            image.onload = () => {
                this._width = image.width;
                this._height = image.height;

                // Could possibly has race condition with other textures here (?)
                gl.bindTexture(gl.TEXTURE_2D, this._texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            image.onerror = () => {
                console.error(`Failed to load texture from path: ${path}`);
            }
        }

        GLMemory.registerResource(this, this._texture);
    }

    public bind(slot? : TextureSlot): void { 
        const gl = renderContext.getWebGLRenderingContext();
        slot = slot || gl.TEXTURE0;
        gl.activeTexture(slot);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }
}