function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

export const math = {
    clamp,
    degToRad,
    radToDeg
};