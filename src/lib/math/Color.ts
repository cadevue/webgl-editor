import Vector4 from "@/lib/math/Vector4";

export class ColorRGBA extends Vector4 {
    static readonly WHITE = new ColorRGBA([1, 1, 1, 1]);
    static readonly BLACK = new ColorRGBA([0, 0, 0, 1]);
    static readonly RED = new ColorRGBA([1, 0, 0, 1]);
    static readonly GREEN = new ColorRGBA([0, 1, 0, 1]);
    static readonly BLUE = new ColorRGBA([0, 0, 1, 1]);
    static readonly CYAN = new ColorRGBA([0, 1, 1, 1]);
    static readonly MAGENTA = new ColorRGBA([1, 0, 1, 1]);
    static readonly YELLOW = new ColorRGBA([1, 1, 0, 1]);
}

export function HexToColorRGBA(hex: string): ColorRGBA {
    let start = 0;
    if (hex.length == 7) {
        start = 1;
    } else if (hex.length != 6) {
        throw new Error("Invalid hex color. use #RRGGBB or RRGGBB");
    }

    const r = parseInt(hex.slice(start, start + 2), 16) / 255;
    const g = parseInt(hex.slice(start + 2, start + 4), 16) / 255;
    const b = parseInt(hex.slice(start + 4, start + 6), 16) / 255;

    return new ColorRGBA([r, g, b, 1]);
}

export function ColorRGBAToHex(color: ColorRGBA): string {
    const r = Math.floor(color.x * 255);
    const g = Math.floor(color.y * 255);
    const b = Math.floor(color.z * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}