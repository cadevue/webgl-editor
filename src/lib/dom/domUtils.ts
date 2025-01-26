const resizeCanvasToDisplaySize = (canvas : HTMLCanvasElement) => {
    if (!canvas)  {
        console.error("Canvas not found, cannot resize");
        return;
    }

    const dpr = window.devicePixelRatio;
    const { width, height } = canvas.getBoundingClientRect();
    const displayWidth = Math.floor(width * dpr);
    const displayHeight = Math.floor(height * dpr);

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

export const domUtils = {
    resizeCanvasToDisplaySize,
}