import Shader from '../rendering/Shader';
import type { ShaderSource } from '../rendering/ShaderType';

/** Import the Main Library */
import Sprite2D from '@/assets/shaders/Sprite2D.glsl?raw';
export enum BuiltInShaderType { Sprite2D }

export default class ShaderLibrary {
    private static _library: Map<string | BuiltInShaderType, Shader> = new Map();

    static init() {
        this._library.set(BuiltInShaderType.Sprite2D, new Shader(ShaderLibrary.parseShaderSource(Sprite2D)));
    }

    static get(name: BuiltInShaderType | string): Shader {
        if (!this._library.has(name)) { 
            throw new Error(`Shader not found: ${name}`);
        }

        return this._library.get(name)!;
    }

    static add(name: string, shader: Shader) {
        if (this._library.has(name)) {
            throw new Error(`Shader already exists: ${name}`);
        }
        this._library.set(name, shader);
    }

    static addFromSource(name: string, source: ShaderSource) {
        if (this._library.has(name)) {
            throw new Error(`Shader already exists: ${name}`);
        }
        this._library.set(name, new Shader(source));
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