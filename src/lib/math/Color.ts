import Vector4 from "@/lib/math/Vector4";

export class ColorRGBA extends Vector4 {}

export function HexToColorRGBA(hex: string): ColorRGBA {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new ColorRGBA([r, g, b, 1]);
}

export function ColorRGBAToHex(color: ColorRGBA): string {
    const r = Math.floor(color.x * 255);
    const g = Math.floor(color.y * 255);
    const b = Math.floor(color.z * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}