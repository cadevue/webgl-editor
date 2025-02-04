export enum KeyCode {
    A = "KeyA", B = "KeyB", C = "KeyC", D = "KeyD",
    E = "KeyE", F = "KeyF", G = "KeyG", H = "KeyH",
    I = "KeyI", J = "KeyJ", K = "KeyK", L = "KeyL",
    M = "KeyM", N = "KeyN", O = "KeyO", P = "KeyP",
    Q = "KeyQ", R = "KeyR", S = "KeyS", T = "KeyT",
    U = "KeyU", V = "KeyV", W = "KeyW", X = "KeyX",
    Y = "KeyY", Z = "KeyZ",

    Digit0 = "Digit0", Digit1 = "Digit1", Digit2 = "Digit2",
    Digit3 = "Digit3", Digit4 = "Digit4", Digit5 = "Digit5",
    Digit6 = "Digit6", Digit7 = "Digit7", Digit8 = "Digit8",
    Digit9 = "Digit9",

    Space = "Space", Enter = "Enter", Tab = "Tab", Escape = "Escape",
    Backspace = "Backspace", Delete = "Delete", Insert = "Insert",

    ArrowUp = "ArrowUp",
    ArrowDown = "ArrowDown",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",

    Home = "Home", End = "End",
    PageUp = "PageUp", PageDown = "PageDown",

    ShiftLeft = "ShiftLeft", ShiftRight = "ShiftRight",
    ControlLeft = "ControlLeft", ControlRight = "ControlRight",
    AltLeft = "AltLeft", AltRight = "AltRight",
    MetaLeft = "MetaLeft", MetaRight = "MetaRight",

    CapsLock = "CapsLock",
    NumLock = "NumLock",
    ScrollLock = "ScrollLock",

    F1 = "F1", F2 = "F2", F3 = "F3", F4 = "F4",
    F5 = "F5", F6 = "F6", F7 = "F7", F8 = "F8",
    F9 = "F9", F10 = "F10", F11 = "F11", F12 = "F12",

    Numpad0 = "Numpad0", Numpad1 = "Numpad1", Numpad2 = "Numpad2", Numpad3 = "Numpad3",
    Numpad4 = "Numpad4", Numpad5 = "Numpad5", Numpad6 = "Numpad6", Numpad7 = "Numpad7",
    Numpad8 = "Numpad8", Numpad9 = "Numpad9",

    NumpadAdd = "NumpadAdd",
    NumpadSubtract = "NumpadSubtract",
    NumpadMultiply = "NumpadMultiply",
    NumpadDivide = "NumpadDivide",
    NumpadDecimal = "NumpadDecimal",
    NumpadEnter = "NumpadEnter",

    Comma = "Comma",
    Period = "Period",
    Slash = "Slash",
    Semicolon = "Semicolon",
    Quote = "Quote",
    BracketLeft = "BracketLeft",
    BracketRight = "BracketRight",
    Backslash = "Backslash",
    Minus = "Minus",
    Equal = "Equal",
    Backquote = "Backquote",
};

export enum MouseButton { Left = 0, Middle = 1, Right = 2, };

export default class Input {
    static init(canvas: HTMLCanvasElement) { 
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        /** Mouse */
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('wheel', this.onMouseWheel.bind(this));

        /** Reset if canvas loses focus */
        window.addEventListener('blur', this.hardReset.bind(this));
        window.addEventListener('focus', this.hardReset.bind(this));
        window.addEventListener('resize', this.hardReset.bind(this));
    }

    private static _keys: Map<KeyCode, boolean> = new Map<KeyCode, boolean>(
        Object.values(KeyCode).map((key) => [key, false])
    );

    private static _mouseButtons: Map<MouseButton | string, boolean> = new Map<MouseButton | string, boolean>(
        Object.values(MouseButton).map((button) => [button, false])
    );
    private static _mousePosition: { x: number, y: number } = { x: 0, y: 0 };
    private static _mouseDelta: { x: number, y: number } = { x: 0, y: 0 };
    private static _mouseWheelDelta: number = 0;

    static isKeyPressed(key: KeyCode): boolean {
        return Input._keys.get(key) || false;
    }

    static isMouseButtonPressed(button: MouseButton): boolean {
        return Input._mouseButtons.get(button) || false;
    }

    static getMousePosition(): { x: number, y: number } {
        return Input._mousePosition;
    }

    static getMouseDelta(): { x: number, y: number } {
        return Input._mouseDelta;
    }

    static getMouseWheelDelta(): number {
        return Input._mouseWheelDelta;
    }

    private static onKeyDown(event: KeyboardEvent): void {
        Input._keys.set(event.code as KeyCode, true);
    }

    private static onKeyUp(event: KeyboardEvent): void {
        Input._keys.set(event.code as KeyCode, false);
    }

    private static onMouseDown(event: MouseEvent): void {
        Input._mouseButtons.set(event.button as MouseButton, true);
    }

    private static onMouseUp(event: MouseEvent): void {
        Input._mouseButtons.set(event.button as MouseButton, false);
    }

    private static onMouseMove(event: MouseEvent): void {
        Input._mouseDelta.x += event.movementX;
        Input._mouseDelta.y += event.movementY;

        Input._mousePosition = { x: event.clientX, y: event.clientY };
    }

    private static onMouseWheel(event: WheelEvent): void {
        if (event.ctrlKey) {
            event.preventDefault()
        }

        Input._mouseWheelDelta = event.deltaY;
    }

    static beginUpdate() { }

    static endUpdate() {
        Input._mouseDelta = { x: 0, y: 0 };
        Input._mouseWheelDelta = 0;
    }

    private static hardReset() {
        Input._keys.forEach((_, key) => Input._keys.set(key, false));
        Input._mouseButtons.forEach((_, button) => Input._mouseButtons.set(button, false));
        Input._mouseDelta = { x: 0, y: 0 };
        Input._mouseWheelDelta = 0;
    }
}
