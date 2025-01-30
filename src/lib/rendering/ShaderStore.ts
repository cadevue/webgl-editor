import Shader from "./Shader";

/** Shader Sources */
import simple2D from "../shaders/simple2D";
import simple2DWithCamera from "../shaders/simple2DWithCamera";

interface ShaderSource {
    vertex: string;
    fragment: string;
}

function ReadonlyMapWithStringKeys<K extends string, V>(
  iterable: Iterable<[K, V]>): ReadonlyMap<K, V> {
  return new Map(iterable)
}


const sources : { [key: string]: ShaderSource } = {
    "simple-2d" : simple2D,
    'simple-2d-with-camera' : simple2DWithCamera,
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