import Vector3 from "@/lib/math/Vector3";
import MathUtils from "@/lib/math/MathUtils";
import type Quaternion from "./Quaternion";

export default class Mat4 extends Float32Array {
    constructor(numbers?: ArrayLike<number>) {
        if (numbers) {
            if (numbers.length < 16) {
                console.warn('Mat4: array is smaller than 16 elements. undefined values will be set to 0');
            } else if (numbers.length > 16) {
                console.warn('Mat4: array is larger than 16 elements. extra values will be ignored');
            }

            const values = [
                numbers[0]  || 0, 
                numbers[1]  || 0,
                numbers[2]  || 0,
                numbers[3]  || 0,
                numbers[4]  || 0,
                numbers[5]  || 0,
                numbers[6]  || 0,
                numbers[7]  || 0,
                numbers[8]  || 0,
                numbers[9]  || 0,
                numbers[10] || 0,
                numbers[11] || 0,
                numbers[12] || 0,
                numbers[13] || 0,
                numbers[14] || 0,
                numbers[15] || 0
            ];
            super(values);
        } else {
            super(16);
        }
    }

    static zeros(dst?: Mat4) : Mat4 {
        dst = dst || new Mat4();
        dst[0]  = 0;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 0;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = 0; 
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 0;
        return dst;
    }

    static ones(dst?: Mat4) : Mat4 {
        dst = dst || new Mat4();
        dst[0]  = 1;    
        dst[1]  = 1;    
        dst[2]  = 1;    
        dst[3]  = 1;
        dst[4]  = 1;    
        dst[5]  = 1;    
        dst[6]  = 1;    
        dst[7]  = 1;
        dst[8]  = 1;    
        dst[9]  = 1;    
        dst[10] = 1;    
        dst[11] = 1;
        dst[12] = 1;    
        dst[13] = 1;    
        dst[14] = 1;    
        dst[15] = 1;
        return dst;
    }

    static identity(dst?: Mat4) : Mat4 {
        dst = dst || new Mat4();
        dst[0]  = 1;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 1;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;
        return dst;
    }

    static copy(m: Mat4, dst?: Mat4) : Mat4 {
        dst = dst || new Mat4();
        dst[0]  = m[0];
        dst[1]  = m[1];
        dst[2]  = m[2];
        dst[3]  = m[3];
        dst[4]  = m[4];
        dst[5]  = m[5];
        dst[6]  = m[6];
        dst[7]  = m[7];
        dst[8]  = m[8];
        dst[9]  = m[9];
        dst[10] = m[10];
        dst[11] = m[11];
        dst[12] = m[12];
        dst[13] = m[13];
        dst[14] = m[14];
        dst[15] = m[15];
        return dst;
    }

    static transpose(m: Mat4, dst?: Mat4) : Mat4 {
        dst = dst || new Mat4();
        dst[0]  = m[0];
        dst[1]  = m[4];
        dst[2]  = m[8];
        dst[3]  = m[12];
        dst[4]  = m[1];
        dst[5]  = m[5];
        dst[6]  = m[9];
        dst[7]  = m[13];
        dst[8]  = m[2];
        dst[9]  = m[6];
        dst[10] = m[10];
        dst[11] = m[14];
        dst[12] = m[3];
        dst[13] = m[7];
        dst[14] = m[11];
        dst[15] = m[15];
        return dst;
    }

    static multiply(a: Mat4, b: Mat4, dst?: Mat4) : Mat4 {
        dst = dst || new Mat4();
        const b00 = b[0 * 4 + 0];
        const b01 = b[0 * 4 + 1];
        const b02 = b[0 * 4 + 2];
        const b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0];
        const b11 = b[1 * 4 + 1];
        const b12 = b[1 * 4 + 2];
        const b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0];
        const b21 = b[2 * 4 + 1];
        const b22 = b[2 * 4 + 2];
        const b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0];
        const b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        const b33 = b[3 * 4 + 3];

        const a00 = a[0 * 4 + 0];
        const a01 = a[0 * 4 + 1];
        const a02 = a[0 * 4 + 2];
        const a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0];
        const a11 = a[1 * 4 + 1];
        const a12 = a[1 * 4 + 2];
        const a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0];
        const a21 = a[2 * 4 + 1];
        const a22 = a[2 * 4 + 2];
        const a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0];
        const a31 = a[3 * 4 + 1];
        const a32 = a[3 * 4 + 2];
        const a33 = a[3 * 4 + 3];

        dst[0]  = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dst[1]  = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dst[2]  = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dst[3]  = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dst[4]  = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dst[5]  = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dst[6]  = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dst[7]  = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dst[8]  = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dst[9]  = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return dst;
    }

    static determinant(m: Mat4): number {
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a03 = m[3];
        const a10 = m[4];
        const a11 = m[5];
        const a12 = m[6];
        const a13 = m[7];
        const a20 = m[8];
        const a21 = m[9];
        const a22 = m[10];
        const a23 = m[11];
        const a30 = m[12];
        const a31 = m[13];
        const a32 = m[14];
        const a33 = m[15];

        const tmp_0  = a22 * a33;
        const tmp_1  = a32 * a23;
        const tmp_2  = a12 * a33;
        const tmp_3  = a32 * a13;
        const tmp_4  = a12 * a23;
        const tmp_5  = a22 * a13;
        const tmp_6  = a02 * a33;
        const tmp_7  = a32 * a03;
        const tmp_8  = a02 * a23;
        const tmp_9  = a22 * a03;
        const tmp_10 = a02 * a13;
        const tmp_11 = a12 * a03;

        const t0 =
            tmp_0 * a11 +
            tmp_3 * a21 +
            tmp_4 * a31 -
            (tmp_1 * a11 + tmp_2 * a21 + tmp_5 * a31);
        const t1 =
            tmp_1 * a01 +
            tmp_6 * a21 +
            tmp_9 * a31 -
            (tmp_0 * a01 + tmp_7 * a21 + tmp_8 * a31);
        const t2 =
            tmp_2 * a01 +
            tmp_7 * a11 +
            tmp_10 * a31 -
            (tmp_3 * a01 + tmp_6 * a11 + tmp_11 * a31);
        const t3 =
            tmp_5 * a01 +
            tmp_8 * a11 +
            tmp_11 * a21 -
            (tmp_4 * a01 + tmp_9 * a11 + tmp_10 * a21);

        return 1.0 / (a00 * t0 + a10 * t1 + a20 * t2 + a30 * t3);
    }

    static inverse(m: Mat4, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a03 = m[3];
        const a10 = m[4];
        const a11 = m[5];
        const a12 = m[6];
        const a13 = m[7];
        const a20 = m[8];
        const a21 = m[9];
        const a22 = m[10];
        const a23 = m[11];
        const a30 = m[12];
        const a31 = m[13];
        const a32 = m[14];
        const a33 = m[15];

        const tmp_0 = a22 * a33;
        const tmp_1 = a32 * a23;
        const tmp_2 = a12 * a33;
        const tmp_3 = a32 * a13;
        const tmp_4 = a12 * a23;
        const tmp_5 = a22 * a13;
        const tmp_6 = a02 * a33;
        const tmp_7 = a32 * a03;
        const tmp_8 = a02 * a23;
        const tmp_9 = a22 * a03;
        const tmp_10 = a02 * a13;
        const tmp_11 = a12 * a03;
        const tmp_12 = a20 * a31;
        const tmp_13 = a30 * a21;
        const tmp_14 = a10 * a31;
        const tmp_15 = a30 * a11;
        const tmp_16 = a10 * a21;
        const tmp_17 = a20 * a11;
        const tmp_18 = a00 * a31;
        const tmp_19 = a30 * a01;
        const tmp_20 = a00 * a21;
        const tmp_21 = a20 * a01;
        const tmp_22 = a00 * a11;
        const tmp_23 = a10 * a01;

        const t0 =
            tmp_0 * a11 +
            tmp_3 * a21 +
            tmp_4 * a31 -
            (tmp_1 * a11 + tmp_2 * a21 + tmp_5 * a31);
        const t1 =
            tmp_1 * a01 +
            tmp_6 * a21 +
            tmp_9 * a31 -
            (tmp_0 * a01 + tmp_7 * a21 + tmp_8 * a31);
        const t2 =
            tmp_2 * a01 +
            tmp_7 * a11 +
            tmp_10 * a31 -
            (tmp_3 * a01 + tmp_6 * a11 + tmp_11 * a31);
        const t3 =
            tmp_5 * a01 +
            tmp_8 * a11 +
            tmp_11 * a21 -
            (tmp_4 * a01 + tmp_9 * a11 + tmp_10 * a21);

        const d = 1.0 / (a00 * t0 + a10 * t1 + a20 * t2 + a30 * t3);

        dst[0] = d * t0;
        dst[1] = d * t1;
        dst[2] = d * t2;
        dst[3] = d * t3;
        dst[4] =
            d * (tmp_1 * a10 +
                tmp_2 * a20 +
                tmp_5 * a30 -
                (tmp_0 * a10 + tmp_3 * a20 + tmp_4 * a30));
        dst[5] =
            d * (tmp_0 * a00 +
                tmp_7 * a20 +
                tmp_8 * a30 -
                (tmp_1 * a00 + tmp_6 * a20 + tmp_9 * a30));
        dst[6] =
            d * (tmp_3 * a00 +
                tmp_6 * a10 +
                tmp_11 * a30 -
                (tmp_2 * a00 + tmp_7 * a10 + tmp_10 * a30));
        dst[7] =
            d * (tmp_4 * a00 +
                tmp_9 * a10 +
                tmp_10 * a20 -
                (tmp_5 * a00 + tmp_8 * a10 + tmp_11 * a20));
        dst[8] =
            d * (tmp_12 * a13 +
                tmp_15 * a23 +
                tmp_16 * a33 -
                (tmp_13 * a13 + tmp_14 * a23 + tmp_17 * a33));
        dst[9] =
            d * (tmp_13 * a03 +
                tmp_18 * a23 +
                tmp_21 * a33 -
                (tmp_12 * a03 + tmp_19 * a23 + tmp_20 * a33));
        dst[10] =
            d * (tmp_14 * a03 +
                tmp_19 * a13 +
                tmp_22 * a33 -
                (tmp_15 * a03 + tmp_18 * a13 + tmp_23 * a33));
        dst[11] =
            d * (tmp_17 * a03 +
                tmp_20 * a13 +
                tmp_23 * a23 -
                (tmp_16 * a03 + tmp_21 * a13 + tmp_22 * a23));
        dst[12] =
            d * (tmp_14 * a22 +
                tmp_17 * a32 +
                tmp_13 * a12 -
                (tmp_16 * a32 + tmp_12 * a12 + tmp_15 * a22));
        dst[13] =
            d * (tmp_20 * a32 +
                tmp_12 * a02 +
                tmp_19 * a22 -
                (tmp_18 * a22 + tmp_21 * a32 + tmp_13 * a02));
        dst[14] =
            d * (tmp_18 * a12 +
                tmp_23 * a32 +
                tmp_15 * a02 -
                (tmp_22 * a32 + tmp_14 * a02 + tmp_19 * a12));
        dst[15] =
            d * (tmp_22 * a22 +
                tmp_16 * a02 +
                tmp_21 * a12 -
                (tmp_20 * a12 + tmp_23 * a22 + tmp_17 * a02));

        return dst;
    }

    static lookAt(cameraPosition: Vector3, target: Vector3, up: Vector3, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const zAxis = Vector3.normalize(Vector3.subtract(cameraPosition, target));
        const xAxis = Vector3.normalize(Vector3.cross(up, zAxis));
        const yAxis = Vector3.normalize(Vector3.cross(zAxis, xAxis));

        dst[0]  = xAxis[0];
        dst[1]  = xAxis[1];
        dst[2]  = xAxis[2];
        dst[3]  = 0;
        dst[4]  = yAxis[0];
        dst[5]  = yAxis[1];
        dst[6]  = yAxis[2];
        dst[7]  = 0;
        dst[8]  = zAxis[0];
        dst[9]  = zAxis[1];
        dst[10] = zAxis[2];
        dst[11] = 0;
        dst[12] = cameraPosition[0];
        dst[13] = cameraPosition[1];
        dst[14] = cameraPosition[2];
        dst[15] = 1;
        return dst;
    }

    static perspective(fov: number, aspect: number, near: number, far: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const rangeInv = 1.0 / (near - far);

        dst[0]  = f / aspect;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = f;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = (near + far) * rangeInv;
        dst[11] = -1;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = near * far * rangeInv * 2;
        dst[15] = 0;

        return dst;
    }

    static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();

        dst[0]  = 2 / (right - left);
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 2 / (top - bottom);
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = -2 / (near - far);
        dst[11] = 0;
        dst[12] = (right + left) / (left - right);
        dst[13] = (top + bottom) / (bottom - top);
        dst[14] = (far + near) / (near - far);
        dst[15] = 1;

        return dst;
    }

    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();

        dst[0]  = (2 * near) / (right - left);
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = (2 * near) / (top - bottom);
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = (right + left) / (right - left);
        dst[9]  = (top + bottom) / (top - bottom);
        dst[10] = (far + near) / (near - far);
        dst[11] = -1;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = (2 * far * near) / (near - far);
        dst[15] = 0;

        return dst;
    }

    static oblique(tetha: number, phi: number, left: number, right: number, bottom: number, top: number, dst?: Mat4): Mat4 {
        const cotTheta = 1 / Math.tan(tetha);
        const cotPhi = 1 / Math.tan(phi);

        dst = dst || new Mat4();

        dst[0]  = 2 / (right - left);
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 2 / (top - bottom);
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = (-2 * cotTheta) / (right - left);
        dst[9]  = (-2 * cotPhi) / (top - bottom);
        dst[10] = 0;
        dst[11] = 0;
        dst[12] = (right + left) / (left - right);
        dst[13] = (top + bottom) / (bottom - top);
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static translation(v: Vector3, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        
        dst[12] = v[0];
        dst[13] = v[1];
        dst[14] = v[2];

        return dst;
    }

    static translate(m: Mat4, v: Vector3, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];
        const m30 = m[12];
        const m31 = m[13];
        const m32 = m[14];
        const m33 = m[15];

        if (m !== dst) {
            dst[0]  = m00;
            dst[1]  = m01;
            dst[2]  = m02;
            dst[3]  = m03;
            dst[4]  = m10;
            dst[5]  = m11;
            dst[6]  = m12;
            dst[7]  = m13;
            dst[8]  = m20;
            dst[9]  = m21;
            dst[10] = m22;
            dst[11] = m23;
        }

        const tx = v[0];
        const ty = v[1];
        const tz = v[2];

        dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
        dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
        dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
        dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

        return dst;
    }

    static xRotation(radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        dst[0]  = 1;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = c;
        dst[6]  = s;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = -s;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static xRotate(m: Mat4, radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        dst[4]  = m10 * c + m20 * s;
        dst[5]  = m11 * c + m21 * s;
        dst[6]  = m12 * c + m22 * s;
        dst[7]  = m13 * c + m23 * s;
        dst[8]  = m10 * -s + m20 * c;
        dst[9]  = m11 * -s + m21 * c;
        dst[10] = m12 * -s + m22 * c;
        dst[11] = m13 * -s + m23 * c;

        if (m !== dst) {
            dst[0]  = m[0];
            dst[1]  = m[1];
            dst[2]  = m[2];
            dst[3]  = m[3];
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }

        return dst;
    }

    static yRotation(radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        dst[0]  = c;
        dst[1]  = 0;
        dst[2]  = -s;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 1;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = s;
        dst[9]  = 0;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static yRotate(m: Mat4, radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();

        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        dst[0]  = m00 * c + m20 * -s;
        dst[1]  = m01 * c + m21 * -s;
        dst[2]  = m02 * c + m22 * -s;
        dst[3]  = m03 * c + m23 * -s;
        dst[8]  = m00 * s + m20 * c;
        dst[9]  = m01 * s + m21 * c;
        dst[10] = m02 * s + m22 * c;
        dst[11] = m03 * s + m23 * c;

        if (m !== dst) {
            dst[4]  = m[4];
            dst[5]  = m[5];
            dst[6]  = m[6];
            dst[7]  = m[7];
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }

        return dst;
    }

    static zRotation(radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        dst[0]  = c;
        dst[1]  = s;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = -s;
        dst[5]  = c;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static zRotate(m: Mat4, radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];

        const c = Math.cos(radians);
        const s = Math.sin(radians);

        dst[0] = m00 * c + m10 * s;
        dst[1] = m01 * c + m11 * s;
        dst[2] = m02 * c + m12 * s;
        dst[3] = m03 * c + m13 * s;
        dst[4] = m00 * -s + m10 * c;
        dst[5] = m01 * -s + m11 * c;
        dst[6] = m02 * -s + m12 * c;
        dst[7] = m03 * -s + m13 * c;

        if (m !== dst) {
            dst[8]  = m[8];
            dst[9]  = m[9];
            dst[10] = m[10];
            dst[11] = m[11];
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }

        return dst;
    }

    static axisRotation(axis: Vector3, radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;

        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        const oneMinusCosine = 1 - c;

        dst[0] = xx + (1 - xx) * c;
        dst[1] = x * y * oneMinusCosine + z * s;
        dst[2] = x * z * oneMinusCosine - y * s;
        dst[3] = 0;
        dst[4] = x * y * oneMinusCosine - z * s;
        dst[5] = yy + (1 - yy) * c;
        dst[6] = y * z * oneMinusCosine + x * s;
        dst[7] = 0;
        dst[8] = x * z * oneMinusCosine + y * s;
        dst[9] = y * z * oneMinusCosine - x * s;
        dst[10] = zz + (1 - zz) * c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static axisRotate(m: Mat4, axis: Vector3, radians: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();

        let x = axis[0];
        let y = axis[1];
        let z = axis[2];

        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;

        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        const oneMinusCosine = 1 - c;
        const xy = x * y;
        const yz = y * z;
        const zx = z * x;
        const xs = x * s;
        const ys = y * s;
        const zs = z * s;

        const r00 = xx + (1 - xx) * c;
        const r01 = xy * oneMinusCosine + zs;
        const r02 = zx * oneMinusCosine - ys;
        const r10 = xy * oneMinusCosine - zs;
        const r11 = yy + (1 - yy) * c;
        const r12 = yz * oneMinusCosine + xs;
        const r20 = zx * oneMinusCosine + ys;
        const r21 = yz * oneMinusCosine - xs;
        const r22 = zz + (1 - zz) * c;

        const m00 = m[0];
        const m01 = m[1];
        const m02 = m[2];
        const m03 = m[3];
        const m10 = m[4];
        const m11 = m[5];
        const m12 = m[6];
        const m13 = m[7];
        const m20 = m[8];
        const m21 = m[9];
        const m22 = m[10];
        const m23 = m[11];

        dst[0]  = r00 * m00 + r01 * m10 + r02 * m20;
        dst[1]  = r00 * m01 + r01 * m11 + r02 * m21;
        dst[2]  = r00 * m02 + r01 * m12 + r02 * m22;
        dst[3]  = r00 * m03 + r01 * m13 + r02 * m23;
        dst[4]  = r10 * m00 + r11 * m10 + r12 * m20;
        dst[5]  = r10 * m01 + r11 * m11 + r12 * m21;
        dst[6]  = r10 * m02 + r11 * m12 + r12 * m22;
        dst[7]  = r10 * m03 + r11 * m13 + r12 * m23;
        dst[8]  = r20 * m00 + r21 * m10 + r22 * m20;
        dst[9]  = r20 * m01 + r21 * m11 + r22 * m21;
        dst[10] = r20 * m02 + r21 * m12 + r22 * m22;
        dst[11] = r20 * m03 + r21 * m13 + r22 * m23;

        if (m !== dst) {
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }

        return dst;
    }

    static scaling(v: Vector3, dst?: Mat4): Mat4 {
        const sx = v[0];
        const sy = v[1];
        const sz = v[2];

        dst = dst || new Mat4();

        dst[0]  = sx;
        dst[1]  = 0;
        dst[2]  = 0;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = sy;
        dst[6]  = 0;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = sz;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static scale(m: Mat4, v: Vector3, dst?: Mat4): Mat4 {
        const sx = v[0];
        const sy = v[1];
        const sz = v[2];

        dst = dst || new Mat4();
        dst[0] = m[0] * sx;
        dst[1] = m[1] * sx;
        dst[2] = m[2] * sx;
        dst[3] = m[3] * sx;
        dst[4] = m[4] * sy;
        dst[5] = m[5] * sy;
        dst[6] = m[6] * sy;
        dst[7] = m[7] * sy;
        dst[8] = m[8] * sz;
        dst[9] = m[9] * sz;
        dst[10] = m[10] * sz;
        dst[11] = m[11] * sz;

        if (m !== dst) {
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }

        return dst;
    }

    static shearingXY(theta: number, phi: number, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const t = Math.tan(MathUtils.degToRad(theta));
        const p = Math.tan(MathUtils.degToRad(phi));

        dst[0]  = 1;
        dst[1]  = 0;
        dst[2]  = 1 / t;
        dst[3]  = 0;
        dst[4]  = 0;
        dst[5]  = 1;
        dst[6]  = 1 / p;
        dst[7]  = 0;
        dst[8]  = 0;
        dst[9]  = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static compose(translation: Vector3, quaternion: Quaternion, scale: Vector3, dst?: Mat4): Mat4 {
        dst = dst || new Mat4();
        const x = quaternion[0],
              y = quaternion[1],
              z = quaternion[2],
              w = quaternion[3];

        const x2 = x + x,
              y2 = y + y,
              z2 = z + z;

        const xx = x * x2,
              xy = x * y2,
              xz = x * z2;

        const yy = y * y2,
              yz = y * z2,
              zz = z * z2;

        const wx = w * x2,
              wy = w * y2,
              wz = w * z2;

        const sx = scale[0],
              sy = scale[1],
              sz = scale[2];

        dst[0]  = (1 - (yy + zz)) * sx;
        dst[1]  = (xy + wz) * sx;
        dst[2]  = (xz - wy) * sx;
        dst[3]  = 0;
        dst[4]  = (xy - wz) * sy;
        dst[5]  = (1 - (xx + zz)) * sy;
        dst[6]  = (yz + wx) * sy;
        dst[7]  = 0;
        dst[8]  = (xz + wy) * sz;
        dst[9]  = (yz - wx) * sz;
        dst[10] = (1 - (xx + yy)) * sz;
        dst[11] = 0;
        dst[12] = translation[0];
        dst[13] = translation[1];
        dst[14] = translation[2];
        dst[15] = 1;

        return dst;
    }
}