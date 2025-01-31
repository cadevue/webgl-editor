export default interface IDirtyConsumable {
    dirty: boolean;
    consume(): void;
}