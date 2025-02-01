import type { IObservable } from "@/lib/interface/Observable";
import type Mat4 from "@/lib/math/Mat4";

export type Vector4Array = [number, number, number, number];

export default class Vector4 extends Float32Array implements IObservable<Vector4> {
    constructor(numbers?: ArrayLike<number>) {
        if (numbers) {
            if (numbers.length < 4) {
                console.warn('Vector4: array is smaller than 4 elements. undefined values will be set to 0');
            } else if (numbers.length > 4) {
                console.warn('Vector4: array is larger than 4 elements. extra values will be ignored');
            }

            const values = [numbers[0] || 0, numbers[1] || 0, numbers[2] || 0, numbers[3] || 0];
            super(values);
        } else {
            super(4);
        }
    }

    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
    get w() { return this[3]; }

    set x(value: number) { this[0] = value; this.notifyDirty(); }
    set y(value: number) { this[1] = value; this.notifyDirty(); }
    set z(value: number) { this[2] = value; this.notifyDirty(); }
    set w(value: number) { this[3] = value; this.notifyDirty(); }

    get r() { return this[0]; }
    get g() { return this[1]; }
    get b() { return this[2]; }
    get a() { return this[3]; }

    set r(value: number) { this.x = value; }
    set g(value: number) { this.y = value; }
    set b(value: number) { this.z = value; }
    set a(value: number) { this.w = value; }

    set(values: Vector4Array) {
        this[0] = values[0];
        this[1] = values[1];
        this[2] = values[2];
        this[3] = values[3];

        this.notifyDirty();
    }

    /** Dirty State Management */
    private _dirtyListeners: Set<(observed : Vector4) => void> = new Set();
    subscribe(listener: (observed : Vector4) => void) { this._dirtyListeners.add(listener); }
    notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }

    toArray() : Vector4Array {
        return [this[0], this[1], this[2], this[3]];
    }

    /** Static Methods */
    static create(x = 0, y = 0, z = 0, w = 0) : Vector4 {
        return new Vector4([x, y, z, w]);
    }

    static zeros(dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = 0;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        return dst;
    }

    static ones(dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = 1;
        dst[1] = 1;
        dst[2] = 1;
        dst[3] = 1;
        return dst;
    }

    static copy(v: Vector4, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = v[0];
        dst[1] = v[1];
        dst[2] = v[2];
        dst[3] = v[3];
        return dst;
    }

    static add(a: Vector4, b: Vector4, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        dst[2] = a[2] + b[2];
        dst[3] = a[3] + b[3];
        return dst;
    }

    static subtract(a: Vector4, b: Vector4, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        dst[2] = a[2] - b[2];
        dst[3] = a[3] - b[3];
        return dst;
    }

    static multiply(a: Vector4, b: Vector4, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        dst[2] = a[2] * b[2];
        dst[3] = a[3] * b[3];
        return dst;
    }

    static scale(v: Vector4, s: number, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        dst[0] = v[0] * s;
        dst[1] = v[1] * s;
        dst[2] = v[2] * s;
        dst[3] = v[3] * s;
        return dst;
    }

    static normalize(v: Vector4, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
        if (length > Number.EPSILON) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
            dst[3] = v[3] / length;
        }
        return dst;
    }

    static dot(a: Vector4, b: Vector4) : number {    
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }

    static distanceSquared(a: Vector4, b: Vector4) : number {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dw = a[3] - b[3];
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    static distance(a: Vector4, b: Vector4) : number {
        return Math.sqrt(Vector4.distanceSquared(a, b));
    }

    static transformMat4(v: Vector4, m: Mat4, dst?: Vector4) : Vector4 {
        dst = dst || new Vector4();
        for (let i = 0; i < 4; i++) {
            dst[i] = 0;
            for (let j = 0; j < 4; j++) {
                dst[i] += v[j] * m[j * 4 + i];
            }
        }
        return dst;
    }
}
