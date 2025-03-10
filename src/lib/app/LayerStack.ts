import type AppLayer from "./Layer";

export default class LayerStack {
    private _layers: AppLayer[] = [];
    private _layerInsertIndex = 0;

    get layers() {
        return this._layers;
    }
    
    pushLayer(layer: AppLayer) {
        this._layers.splice(this._layerInsertIndex, 0, layer);
        this._layerInsertIndex++;
        layer.onAttach?.();
    }

    popLayer(layer: AppLayer) {
        const index = this._layers.indexOf(layer);
        if (index !== -1) {
            this._layers.splice(index, 1);
            this._layerInsertIndex--;
            layer.onDetach?.();
        }
    }
}