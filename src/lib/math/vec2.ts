export class Vector2 extends Float32Array {
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

    set x(value: number) { this[0] = value; }
    set y(value: number) { this[1] = value; }

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

    static copy(v: Vector2, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = v[0];
        dst[1] = v[1];
        return dst;
    }

    static add(a: Vector2, b: Vector2, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        return dst;
    }

    static subtract(a: Vector2, b: Vector2, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        return dst;
    }

    static multiply(a: Vector2, b: Vector2, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        return dst;
    }

    static scale(v: Vector2, s: number, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        dst[0] = v[0] * s;
        dst[1] = v[1] * s;
        return dst;
    }

    static normalize(v: Vector2, dst?: Vector2) : Vector2 {
        dst = dst || new Vector2();
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        if (length > Number.EPSILON) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
        }
        return dst;
    }

    static lengthSq(v: Vector2) : number {
        return v[0] * v[0] + v[1] * v[1];
    }

    static length(v: Vector2) : number {
        return Math.sqrt(Vector2.lengthSq(v));
    }

    static dot(a: Vector2, b: Vector2) : number {
        return a[0] * b[0] + a[1] * b[1];
    }

    static distanceSq(a: Vector2, b: Vector2) : number {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }

    static distance(a: Vector2, b: Vector2) : number {
        return Math.sqrt(Vector2.distanceSq(a, b));
    }
}
