export interface IObservable<T> {
    subscribe: (listener: (newVal : T) => void) => void;
}