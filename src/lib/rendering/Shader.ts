import { renderContext } from "@/renderContext";
import type Vector2 from "@/lib/math/Vector2";
import type Vector3 from "@/lib/math/Vector3";
import type Vector4 from "@/lib/math/Vector4";
import type Mat4 from "@/lib/math/Mat4";
import GLMemory from "./GLMemory";

export default class Shader {
    private _program: WebGLProgram;
    private _uniformCache: Map<string, WebGLUniformLocation> = new Map();

    get program()   { return this._program; }

    constructor(sources: Map<GLenum, string>) {
        const gl = renderContext.getWebGLRenderingContext();


        if (sources.size > 3) {
            throw new Error("Currently only supports 3 shaders");
        }

        const shaders: [WebGLShader | null, WebGLShader | null, WebGLShader | null] = [null, null, null];
        this._program = gl.createProgram() as WebGLProgram;

        let i = 0;
        sources.forEach((source, type) => {
            const shader = gl.createShader(type) as WebGLShader;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error("Failed to compile shader: " + gl.getShaderInfoLog(shader));
            }

            gl.attachShader(this._program, shader);
            shaders[i++] = shader;
        });

        for (i = 0; i < shaders.length; i++) {
            if (shaders[i]) {
                gl.deleteShader(shaders[i]);
            } else { break; }
        }

        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            throw new Error("Failed to link shader program: " + gl.getProgramInfoLog(this._program));
        }

        GLMemory.registerResource(this, this._program);
    }

    bind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.useProgram(this._program);
        renderContext.setActiveShader(this);
    }

    unbind() {
        const gl = renderContext.getWebGLRenderingContext();
        gl.useProgram(null);
        renderContext.setActiveShader(null);
    }

    private getUniformLocation(name: string): WebGLUniformLocation {
        if (this._uniformCache.has(name)) {
            return this._uniformCache.get(name) as WebGLUniformLocation;
        } else {
            const gl = renderContext.getWebGLRenderingContext();
            const location = gl.getUniformLocation(this._program, name);
            if (location) {
                this._uniformCache.set(name, location);
                return location;
            } else {
                throw new Error(`Uniform ${name} not found in shader`);
            }
        }
    }

    setMat4(name: string, matrix: Mat4) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniformMatrix4fv(location, false, matrix);
    }

    setFloat(name: string, value: number) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform1f(location, value);
    }

    setFloat2(name: string, value: Vector2) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform2f(location, value.x, value.y);
    }

    setFloat3(name: string, value: Vector3) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform3fv(location, value);
    }

    setFloat4(name: string, value: Vector4) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform4fv(location, value);
    }

    setInt(name: string, value: number) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform1i(location, value);
    }

    setInt2(name: string, value: Vector2) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform2i(location, value.x, value.y);
    }

    setInt3(name: string, value: Vector3) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform3iv(location, value);
    }

    setInt4(name: string, value: Vector4) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform4iv(location, value);
    }
}