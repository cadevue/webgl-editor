type GLContext = {
    gl: WebGL2RenderingContext | null;
}

export const glContext : GLContext = $state({
    gl: null,
});