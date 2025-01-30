import Shader from "./Shader";

interface ShaderSource {
    vertex: string;
    fragment: string;
}

const sources : { [key: string]: ShaderSource } = {
    "2d-with-vert-color" : {
        vertex : `
            attribute vec4 a_Position;
            attribute vec4 a_Color;

            varying vec4 v_Color;

            void main() {
                gl_Position = a_Position;
                v_Color = a_Color;
            }
        `,
        fragment : `
            precision mediump float;

            varying vec4 v_Color;

            void main() {
                gl_FragColor = v_Color;
            }
        `
    }
}

export default class ShaderStore {
    private static _store : ShaderStore;
    private _shaders : { [key: string]: Shader };

    private constructor() {
        this._shaders = {};
        for (let key in sources) {
            this._shaders[key] = new Shader(sources[key].vertex, sources[key].fragment);
        }
    }

    static get instance() : ShaderStore {
        if (!ShaderStore._store) {
            ShaderStore._store = new ShaderStore();
        }

        return ShaderStore._store;
    }

    getShader(name: string): Shader {
        if (!this._shaders[name]) {
            throw new Error(`Shader source with name ${name} not found`);
        }

        return this._shaders[name];
    }
}