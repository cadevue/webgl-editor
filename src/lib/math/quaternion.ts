import { Vector3 } from "./vec3";
import { Vector4 } from "./vec4";

export class Quaternion extends Vector4 {
    static fromEuler(euler: Vector3, dst?: Quaternion) : Quaternion {
        dst = dst || new Quaternion();

        let x = euler[0],
        y = euler[1],
        z = euler[2];

        const halfToRad = (0.5 * Math.PI) / 180.0;

        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        const sx = Math.sin(x);
        const cx = Math.cos(x);
        const sy = Math.sin(y);
        const cy = Math.cos(y);
        const sz = Math.sin(z);
        const cz = Math.cos(z);

        dst[0] = sx * cy * cz + cx * sy * sz;
        dst[1] = cx * sy * cz - sx * cy * sz;
        dst[2] = cx * cy * sz - sx * sy * cz;
        dst[3] = cx * cy * cz + sx * sy * sz;

        return dst;
    }

    static fromMatrix4(m: Float32Array, dst?: Quaternion) : Quaternion {
        dst = dst || new Vector4();

        const m11 = m[0],
              m12 = m[4],
              m13 = m[8];

        const m21 = m[1],
              m22 = m[5],
              m23 = m[9];

        const m31 = m[2],
              m32 = m[6],
              m33 = m[10];

        const trace = m11 + m22 + m33;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            dst[3] = 0.25 / s;
            dst[0] = (m32 - m23) * s;
            dst[1] = (m13 - m31) * s;
            dst[2] = (m21 - m12) * s;

        } else if (m11 > m22 && m11 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            dst[3] = (m32 - m23) / s;
            dst[0] = 0.25 * s;
            dst[1] = (m12 + m21) / s;
            dst[2] = (m13 + m31) / s;

        } else if (m22 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            dst[3] = (m13 - m31) / s;
            dst[0] = (m12 + m21) / s;
            dst[1] = 0.25 * s;
            dst[2] = (m23 + m32) / s;

        } else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
            dst[3] = (m21 - m12) / s;
            dst[0] = (m13 + m31) / s;
            dst[1] = (m23 + m32) / s;
            dst[2] = 0.25 * s;
        }

        return dst;
    }

    static toEuler(q: Quaternion, dst?: Vector3) : Vector3 {
        dst = dst || new Vector3();

        const sqw = q[3] * q[3];
        const sqx = q[0] * q[0];
        const sqy = q[1] * q[1];
        const sqz = q[2] * q[2];

        const unit = sqx + sqy + sqz + sqw;
        const test = q[0] * q[1] + q[2] * q[3];

        if (test > 0.499 * unit) {
            dst[1] = 2 * Math.atan2(q[0], q[3]);
            dst[0] = Math.PI / 2;
            dst[2] = 0;
        } else if (test < -0.499 * unit) {
            dst[1] = -2 * Math.atan2(q[0], q[3]);
            dst[0] = -Math.PI / 2;
            dst[2] = 0;
        } else {
            dst[1] = Math.atan2(2 * q[1] * q[3] - 2 * q[0] * q[2], sqx - sqy - sqz + sqw);
            dst[0] = Math.asin(2 * test / unit);
            dst[2] = Math.atan2(2 * q[0] * q[3] - 2 * q[1] * q[2], -sqx + sqy - sqz + sqw);
        }

        return dst;
    }
}