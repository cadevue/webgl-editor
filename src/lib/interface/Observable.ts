export interface IObservable<T> {
    /** Subscribe to changes in the observable */
    // Implementation is up to the class implementation
    // e.g. for dirty state tracking
    subscribe: (listener: (observed : T) => void) => void;
}