import { renderContext } from "@/context";
import type Vector2 from "@/lib/math/Vector2";
import type Vector3 from "@/lib/math/Vector3";
import type Vector4 from "@/lib/math/Vector4";
import type Mat4 from "@/lib/math/Mat4";

export default class Shader {
    private _program: WebGLProgram;
    private _uniformCache: Map<string, WebGLUniformLocation> = new Map();

    constructor(vertexSrc: string, fragmentSrc: string) {
        const gl = renderContext.getWebGLRenderingContext();

        const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vertexShader, vertexSrc);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error("Failed to compile vertex shader: " + gl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fragmentShader, fragmentSrc);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            gl.deleteShader(vertexShader);
            throw new Error("Failed to compile fragment shader: " + gl.getShaderInfoLog(fragmentShader));
        }

        this._program = gl.createProgram() as WebGLProgram;

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);    
            throw new Error("Failed to link shader program: " + gl.getProgramInfoLog(this._program));
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
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

    uploadUniformMat4(name: string, matrix: Mat4) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniformMatrix4fv(location, false, matrix);
    }

    uploadUniformFloat(name: string, value: number) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform1f(location, value);
    }

    uploadUniformFloat2(name: string, value: Vector2) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform2f(location, value.x, value.y);
    }

    uploadUniformFloat3(name: string, value: Vector3) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform3fv(location, value);
    }

    uploadUniformFloat4(name: string, value: Vector4) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform4fv(location, value);
    }

    uploadUniformInt(name: string, value: number) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform1i(location, value);
    }

    uploadUniformInt2(name: string, value: Vector2) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform2i(location, value.x, value.y);
    }

    uploadUniformInt3(name: string, value: Vector3) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform3iv(location, value);
    }

    uploadUniformInt4(name: string, value: Vector4) {
        const location = this.getUniformLocation(name);
        const gl = renderContext.getWebGLRenderingContext();
        gl.uniform4iv(location, value);
    }


    get program()   { return this._program; }
}