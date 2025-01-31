export interface IDirtyConsumable {
    dirty: boolean;
    consume(): void;
}