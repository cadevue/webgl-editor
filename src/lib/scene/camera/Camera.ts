// Will think about this implementation (about ECS and stuff)
import type Node from "../Node";
import NodeComponent from "../NodeComponent";
import { OrthographicCameraProjection, type CameraProjection } from "./CameraProjection";

// export class Camera extends NodeComponent {
//     private _owner: Node;
//     private _projection: CameraProjection;

//     constructor(owner: Node, projection?: CameraProjection) {
//         super();
//         this._owner = owner;
//         this._projection = projection ? projection : new OrthographicCameraProjection(-1, 1, -1, 1, 0, 1);
//     }

//     get projection(): CameraProjection { return this._projection; }
//     get transform() { return this._owner.transform; }
//     get position() { return this._owner.transform.position; }
//     get rotation() { return this._owner.transform.rotation; }
//     get scale() { return this._owner.transform.scale; }
// }