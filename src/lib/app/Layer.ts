export default interface AppLayer {
    onAttach? : () => void;
    onDetach? : () => void;
    onUpdate? : (deltaTime: number) => void;
}