/** Canvas Resize API */
// This implementation is using ResizeObserver, as per this article
// https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

const canvasToDisplaySizeMap = new Map<HTMLCanvasElement, number[]>();

function onResize(entries : ResizeObserverEntry[]) {
    for (const entry of entries) {
        let width;
        let height;
        let dpr = window.devicePixelRatio;

        if (entry.devicePixelContentBoxSize) {
            width = entry.devicePixelContentBoxSize[0].inlineSize;
            height = entry.devicePixelContentBoxSize[0].blockSize;
            dpr = 1;
        } else if (entry.contentBoxSize) {
            if (entry.contentBoxSize[0]) {
                width = entry.contentBoxSize[0].inlineSize;
                height = entry.contentBoxSize[0].blockSize;
            } else {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
        } else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        }

        const displayWidth = Math.floor(width * dpr);
        const displayHeight = Math.floor(height * dpr);
        canvasToDisplaySizeMap.set(entry.target as HTMLCanvasElement, [displayWidth, displayHeight]);
    }
}

const onResizeCallbacks = Array<(width: number, height: number) => void>();
function addResizeCallback(callback : (width: number, height: number) => void) {
    onResizeCallbacks.push(callback);
}

const resizeObserver = new ResizeObserver(onResize);

function resizeCanvasToDisplaySize(canvas : HTMLCanvasElement) {
    const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas) || [0, 0];

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        onResizeCallbacks.forEach(callback => callback(displayWidth, displayHeight));
    }
}

function initCanvas(canvas : HTMLCanvasElement) {
    const dpr = window.devicePixelRatio;
    const { width, height } = canvas.getBoundingClientRect();
    const displayWidth = Math.floor(width * dpr);
    const displayHeight = Math.floor(height * dpr);

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    canvasToDisplaySizeMap.set(canvas, [canvas.width, canvas.height]);
    try {
        resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
    } catch (e) {
        resizeObserver.observe(canvas, { box: 'content-box' });
    }
}

function setCursor(cursor : string) {
    document.body.style.cursor = cursor;
}

const DOMUtils = {
    initCanvas,
    addResizeCallback,
    resizeCanvasToDisplaySize,
    setCursor,
}

export default DOMUtils;