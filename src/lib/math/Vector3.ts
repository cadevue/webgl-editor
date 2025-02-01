import type { IObservable } from "@/lib/interface/Observable";
import Mat4 from "@/lib/math/Mat4";
import type { FieldRenderer, ISerializableField } from "../interface/InspectorSerialization";
import Vector3Field from "@/ui/fields/Vector3Field.svelte";

export type Vector3Array = [number, number, number];

export default class Vector3 extends Float32Array implements IObservable<Vector3>, ISerializableField {
    constructor(numbers?: ArrayLike<number>) {
        if (numbers) {
            if (numbers.length < 3) {
                console.warn('Vector3: array is smaller than 3 elements. undefined values will be set to 0');
            } else if (numbers.length > 3) {
                console.warn('Vector3: array is larger than 3 elements. extra values will be ignored');
            }

            const values = [numbers[0] || 0, numbers[1] || 0, numbers[2] || 0];
            super(values);
        } else {
            super(3);
        }
    }

    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }

    set x(value: number) { this[0] = value; this.notifyDirty(); }
    set y(value: number) { this[1] = value; this.notifyDirty(); }
    set z(value: number) { this[2] = value; this.notifyDirty(); }

    get r() { return this[0]; }
    get g() { return this[1]; }
    get b() { return this[2]; }

    set r(value: number) { this.x = value; }
    set g(value: number) { this.y = value; }
    set b(value: number) { this.z = value; }

    set(values: Vector3Array) {
        this[0] = values[0];
        this[1] = values[1];
        this[2] = values[2];

        this.notifyDirty();
    }

    /** Dirty State Management */
    private _dirtyListeners: Set<(observed : Vector3) => void> = new Set();
    subscribe(listener: (observed : Vector3) => void) { this._dirtyListeners.add(listener); }
    notifyDirty() { this._dirtyListeners.forEach(listener => listener(this)); }

    /** Inspector Serialization */
    getFieldRenderer() : FieldRenderer {
        return { component: Vector3Field, props: { target: this, } };
    }

    toArray() : Vector3Array {
        return [this[0], this[1], this[2]];
    }

    /** Static Methods */
    static create(x = 0, y = 0, z = 0) : Vector3 {
        return new Vector3([x, y, z]);
    }

    static zeros(dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = 0;
        dst[1] = 0;
        dst[2] = 0;
        return dst;
    }

    static ones(dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = 1;
        dst[1] = 1;
        dst[2] = 1;
        return dst;
    }

    static copy(v: Vector3, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = v[0];
        dst[1] = v[1];
        dst[2] = v[2];
        return dst;
    }

    static add(a: Vector3, b: Vector3, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        dst[2] = a[2] + b[2];
        return dst;
    }

    static subtract(a: Vector3, b: Vector3, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        dst[2] = a[2] - b[2];
        return dst;
    }

    static multiply(a: Vector3, b: Vector3, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        dst[2] = a[2] * b[2];
        return dst;
    }

    static scale(v: Vector3, s: number, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = v[0] * s;
        dst[1] = v[1] * s;
        dst[2] = v[2] * s;
        return dst;
    }

    static normalize(v: Vector3, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (length > Number.EPSILON) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }

        return dst;
    }

    static lengthSq(v: Vector3) : number {
        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }

    static length(v: Vector3) : number {
        return Math.sqrt(Vector3.lengthSq(v));
    }

    static dot(a: Vector3, b: Vector3) : number {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    static cross(a: Vector3, b: Vector3, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        dst[0] = a[1] * b[2] - a[2] * b[1];
        dst[1] = a[2] * b[0] - a[0] * b[2];
        dst[2] = a[0] * b[1] - a[1] * b[0];
        return dst;
    }

    static distanceSq(a: Vector3, b: Vector3) : number {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return dx * dx + dy * dy + dz * dz;
    }

    static distance(a: Vector3, b: Vector3) : number {
        return Math.sqrt(Vector3.distanceSq(a, b));
    }

    static transformPositionMat4(v: Vector3, m: Mat4, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const d = v0 * m[3] + v1 * m[7] + v2 * m[11] + m[15];

        dst[0] = (v0 * m[0] + v1 * m[4] + v2 * m[8] + m[12]) / d;
        dst[1] = (v0 * m[1] + v1 * m[5] + v2 * m[9] + m[13]) / d;
        dst[2] = (v0 * m[2] + v1 * m[6] + v2 * m[10] + m[14]) / d;

        return dst;
    }

    static transformDirectionMat4(v: Vector3, m: Mat4, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();

        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];

        dst[0] = v0 * m[0] + v1 * m[4] + v2 * m[8];
        dst[1] = v0 * m[1] + v1 * m[5] + v2 * m[9];
        dst[2] = v0 * m[2] + v1 * m[6] + v2 * m[10];

        return dst;
    }

    static transformNormalMat4(v: Vector3, m: Mat4, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();

        const mi = Mat4.inverse(m);
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];

        dst[0] = v0 * mi[0] + v1 * mi[4] + v2 * mi[8];
        dst[1] = v0 * mi[1] + v1 * mi[5] + v2 * mi[9];
        dst[2] = v0 * mi[2] + v1 * mi[6] + v2 * mi[10];

        return dst;
    }
}