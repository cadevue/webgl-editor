import Vector3 from "@/lib/math/Vector3";
import MathUtils from "@/lib/math/MathUtils";
import type Quaternion from "@/lib/math/Quaternion";

export default class Mat3 extends Float32Array {
    constructor(numbers?: ArrayLike<number>) {
        if (numbers) {
            if (numbers.length < 9) {
                console.warn('Mat3: array is smaller than 9 elements. undefined values will be set to 0');
            } else if (numbers.length > 9) {
                console.warn('Mat3: array is larger than 9 elements. extra values will be ignored');
            }

            const values = [
                numbers[0] || 0, 
                numbers[1] || 0,
                numbers[2] || 0,
                numbers[3] || 0,
                numbers[4] || 0,
                numbers[5] || 0,
                numbers[6] || 0,
                numbers[7] || 0,
                numbers[8] || 0
            ];
            super(values);
        } else {
            super(9);
        }
    }

    static zeros(dst?: Mat3) : Mat3 {
        dst = dst || new Mat3();
        dst[0]  = 0;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 0;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        return dst;
    }

    static ones(dst?: Mat3) : Mat3 {
        dst = dst || new Mat3();
        dst[0]  = 1;    
        dst[1]  = 1;    
        dst[2]  = 1;    
        dst[3]  = 1;
        dst[4]  = 1;    
        dst[5]  = 1;    
        dst[6]  = 1;    
        dst[7]  = 1;
        dst[8]  = 1;    
        return dst;
    }

    static identity(dst?: Mat3) : Mat3 {
        dst = dst || new Mat3();
        dst[0]  = 1;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 1;
        dst[5]  = 0;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 1;

        return dst;
    }

    static copy(m: Mat3, dst?: Mat3) : Mat3 {
        dst = dst || new Mat3();
        dst[0]  = m[0];
        dst[1]  = m[1];
        dst[2]  = m[2];
        dst[3]  = m[3];
        dst[4]  = m[4];
        dst[5]  = m[5];
        dst[6]  = m[6];
        dst[7]  = m[7];
        dst[8]  = m[8];
        return dst;
    }

    static transpose(m: Mat3, dst?: Mat3) : Mat3 {
        dst = dst || new Mat3();
        if (dst === m) {
            let a01 = m[1], a02 = m[2], a12 = m[5];
            dst[1] = m[3];
            dst[2] = m[6];
            dst[3] = a01;
            dst[5] = m[7];
            dst[6] = a02;
            dst[7] = a12;
        } else {
            dst[0]  = m[0];
            dst[1]  = m[3];
            dst[2]  = m[6];
            dst[3]  = m[1];
            dst[4]  = m[4];
            dst[5]  = m[7];
            dst[6]  = m[2];
            dst[7]  = m[5];
            dst[8]  = m[8];
        }

        return dst;
    }

    static multiply(a: Mat3, b: Mat3, dst?: Mat3) : Mat3 {
        dst = dst || new Mat3();

        const b00 = a[0];
        const b01 = a[1];
        const b02 = a[2];
        const b10 = a[3];
        const b11 = a[4];
        const b12 = a[5];
        const b20 = a[6];
        const b21 = a[7];
        const b22 = a[8];

        const a00 = b[0];
        const a01 = b[1];
        const a02 = b[2];
        const a10 = b[3];
        const a11 = b[4];
        const a12 = b[5];
        const a20 = b[6];
        const a21 = b[7];
        const a22 = b[8];

        dst[0] = b00 * a00 + b01 * a10 + b02 * a20;
        dst[1] = b00 * a01 + b01 * a11 + b02 * a21;
        dst[2] = b00 * a02 + b01 * a12 + b02 * a22;
        dst[3] = b10 * a00 + b11 * a10 + b12 * a20;
        dst[4] = b10 * a01 + b11 * a11 + b12 * a21;
        dst[5] = b10 * a02 + b11 * a12 + b12 * a22;
        dst[6] = b20 * a00 + b21 * a10 + b22 * a20;
        dst[7] = b20 * a01 + b21 * a11 + b22 * a21;
        dst[8] = b20 * a02 + b21 * a12 + b22 * a22;

        return dst;
    }

    static determinant(m: Mat3): number {
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a10 = m[3];
        const a11 = m[4];
        const a12 = m[5];
        const a20 = m[6];
        const a21 = m[7];
        const a22 = m[8];

        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }

    static inverse(m: Mat3, dst?: Mat3): Mat3 {
        dst = dst || new Mat3();
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a10 = m[3];
        const a11 = m[4];
        const a12 = m[5];
        const a20 = m[6];
        const a21 = m[7];
        const a22 = m[8];

        const det = Mat3.determinant(m);

        if (det === 0) {
            return Mat3.zeros(dst);
        }

        dst[0] = a11 * a22 - a12 * a21;
        dst[1] = a02 * a21 - a01 * a22;
        dst[2] = a01 * a12 - a02 * a11;
        dst[3] = a12 * a20 - a10 * a22;
        dst[4] = a00 * a22 - a02 * a20;
        dst[5] = a02 * a10 - a00 * a12;
        dst[6] = a10 * a21 - a11 * a20;
        dst[7] = a01 * a20 - a00 * a21;
        dst[8] = a00 * a11 - a01 * a10;

        const invDet = 1.0 / det;
        dst[0] *= invDet;
        dst[1] *= invDet;
        dst[2] *= invDet;
        dst[3] *= invDet;
        dst[4] *= invDet;
        dst[5] *= invDet;
        dst[6] *= invDet;
        dst[7] *= invDet;
        dst[8] *= invDet;

        return dst;
    }

    toString(): string {
        return `Mat3
( ${this[0]}, ${this[1]}, ${this[2]}
  ${this[3]}, ${this[4]}, ${this[5]}
  ${this[6]}, ${this[7]}, ${this[8]} )`;
    }
}