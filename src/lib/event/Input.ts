import { KeyCode, MouseButton } from "./InputType";

export default class Input {
    private static _instance: Input = new Input();
    private constructor() { 
        this.initialize(); 
    }

    private _keys: Map<KeyCode, boolean> = new Map<KeyCode, boolean>(
        Object.values(KeyCode).map((key) => [key, false])
    );

    private _mouseButtons: Map<MouseButton | string, boolean> = new Map<MouseButton | string, boolean>(
        Object.values(MouseButton).map((button) => [button, false])
    );
    private _mousePosition: { x: number, y: number } = { x: 0, y: 0 };
    private _mouseDelta: { x: number, y: number } = { x: 0, y: 0 };
    private _mouseWheelDelta: number = 0;

    private initialize(): void {
        /** Keyboard */
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        /** Mouse */
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('wheel', this.onMouseWheel.bind(this));
    }

    static isKeyPressed(key: KeyCode): boolean {
        return this._instance._keys.get(key) || false;
    }

    static isMouseButtonPressed(button: MouseButton): boolean {
        return this._instance._mouseButtons.get(button) || false;
    }

    static getMousePosition(): { x: number, y: number } {
        return this._instance._mousePosition;
    }

    static getMouseDelta(): { x: number, y: number } {
        return this._instance._mouseDelta;
    }

    static getMouseWheelDelta(): number {
        return this._instance._mouseWheelDelta;
    }

    private onKeyDown(event: KeyboardEvent): void {
        this._keys.set(event.code as KeyCode, true);
    }

    private onKeyUp(event: KeyboardEvent): void {
        this._keys.set(event.code as KeyCode, false);
    }

    private onMouseDown(event: MouseEvent): void {
        this._mouseButtons.set(event.button as MouseButton, true);
    }

    private onMouseUp(event: MouseEvent): void {
        this._mouseButtons.set(event.button as MouseButton, false);
    }

    private onMouseMove(event: MouseEvent): void {
        this._mouseDelta = { x: event.movementX, y: event.movementY };
        this._mousePosition = { x: event.clientX, y: event.clientY };
    }

    private onMouseWheel(event: WheelEvent): void {
        this._mouseWheelDelta = event.deltaY;
    }
}
