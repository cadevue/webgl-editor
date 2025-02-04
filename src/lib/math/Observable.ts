import type { IObservable } from "../interface/IObservable";

/** Observable class FOR PRIMITIVE TYPES ONLY */
// For more complex types, implements the IObservable interface manually
export default class Observable<T> implements IObservable<T> {
    private _value: T;
    constructor(value: T) { 
        this._value = value;
    }

    get value() { return this._value; }
    set value(value: T) { this._value = value; this.notifyDirty(); }

    /** Dirty State Management */
    private _dirtyListeners: Set<(observed : T) => void> = new Set();
    subscribe(listener: (observed : T) => void) { 
        this._dirtyListeners.add(listener); 
        this.notifyDirty(); 
    }
    notifyDirty() { this._dirtyListeners.forEach(listener => listener(this as unknown as T)); }
}