import Shader, { type ShaderSource } from '@/lib/rendering/Shader';

/** Import the Main Library */
import Flat2DSource from '@/assets/shaders/Flat2D.glsl?raw';
import Textured2DSource from '@/assets/shaders/Textured2D.glsl?raw';

export enum ShaderAsset { 
    Flat2D, 
    Textured2D 
}

export default class ShaderLibrary {
    private static _library: Map<string | ShaderAsset, Shader> = new Map();

    static init() {
        this._library.set(ShaderAsset.Flat2D, new Shader(ShaderLibrary.parseShaderSource(Flat2DSource)));
        this._library.set(ShaderAsset.Textured2D, new Shader(ShaderLibrary.parseShaderSource(Textured2DSource)));
    }

    static get(asset: ShaderAsset | string): Shader | undefined {
        return this._library.get(asset);
    }

    static addToLib(asset: string, shader: Shader) {
        this._library.set(asset, shader);
    }
    
    static addToLibFromSource(asset: string, source: ShaderSource) {
        this._library.set(asset, new Shader(source));
    }

    /** Shader Helper */
    private static shaderTypeStringToGLEnum(type: string): GLenum {
        switch (type) {
            case 'vertex': return WebGLRenderingContext.VERTEX_SHADER;
            case 'fragment': return WebGLRenderingContext.FRAGMENT_SHADER;
            case 'pixel': return WebGLRenderingContext.FRAGMENT_SHADER;
        }

        throw new Error(`Unknown shader type: ${type} | maybe a mistake in the shader source`);
    }

    private static parseShaderSource(shaderSource: string): ShaderSource {
        const sections = shaderSource.split('#type ').slice(1);
        const shaderMap = new Map<GLenum, string>();

        for (const section of sections) {
            const lines = section.split('\n');
            const type = lines[0].trim();
            const source = lines.slice(1).join('\n');
            const glEnum = ShaderLibrary.shaderTypeStringToGLEnum(type);

            if (glEnum !== null) {
                shaderMap.set(glEnum, source);
            }
        }

        return shaderMap;
    }
}