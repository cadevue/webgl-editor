import type { IObservable } from "@/lib/interface/IObservable";

export type Vector2Array = [number, number];
export type Vector2Like = Vector2 | Vector2Array;

export default class Vector2 extends Float32Array implements IObservable<Vector2> {
    constructor(numbers?: ArrayLike<number>) {
        if (numbers) {
            if (numbers.length < 2) {
                console.warn('Vector2: array is smaller than 2 elements. undefined values will be set to 0');
            } else if (numbers.length > 2) {
                console.warn('Vector2: array is larger than 2 elements. extra values will be ignored');
            }

            const values = [numbers[0] || 0, numbers[1] || 0];
            super(values);
        } else {
            super(2);
        }
    }

    get x() { return this[0]; }
    get y() { return this[1]; }

    set x(value: number) { this[0] = value; this.notifyDirty(); }
    set y(value: number) { this[1] = value; this.notifyDirty(); }

    get r() { return this[0]; }
    get g() { return this[1]; }

    set r(value: number) { this.x = value; }
    set g(value: number) { this.y = value; }

    set(values: Vector2Like) {
        this[0] = values[0];
        this[1] = values[1];

        this.notifyDirty();
    }

    /** Dirty State Management */
    private _dirtyListeners: Set<(observed : Vector2) => void> = new Set();
    subscribe(listener: (observed : Vector2) => void) { 
        this._dirtyListeners.add(listener); 
        this.notifyDirty(); 
    }
    notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }

    toArray() : Vector2Array {
        return [this[0], this[1]];
    }

    /** Static Methods */
    static create(x = 0, y = 0) : Vector2 {
        return new Vector2([x, y]);
    }

    static zeros(dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = 0;
        dst[1] = 0;
        return dst;
    }

    static ones(dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = 1;
        dst[1] = 1;
        return dst;
    }

    static copy(v: Vector2Like, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = v[0];
        dst[1] = v[1];
        return dst;
    }

    static add(a: Vector2Like, b: Vector2Like, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        return dst;
    }

    static subtract(a: Vector2Like, b: Vector2Like, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        return dst;
    }

    static multiply(a: Vector2Like, b: Vector2Like, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        return dst;
    }

    static scale(v: Vector2Like, s: number, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = v[0] * s;
        dst[1] = v[1] * s;
        return dst;
    }

    static normalize(v: Vector2Like, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        if (length > Number.EPSILON) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
        }
        return dst;
    }

    static lengthSq(v: Vector2Like) : number {
        return v[0] * v[0] + v[1] * v[1];
    }

    static length(v: Vector2Like) : number {
        return Math.sqrt(Vector2.lengthSq(v));
    }

    static dot(a: Vector2Like, b: Vector2Like) : number {
        return a[0] * b[0] + a[1] * b[1];
    }

    static distanceSq(a: Vector2Like, b: Vector2Like) : number {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }

    static distance(a: Vector2Like, b: Vector2Like) : number {
        return Math.sqrt(Vector2.distanceSq(a, b));
    }
}
