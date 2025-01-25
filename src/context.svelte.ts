type GLContext = {
    canvas: HTMLCanvasElement | null;
    gl: WebGL2RenderingContext | null;
}

export const glContext : GLContext = $state({
    canvas: null,
    gl: null,
});