import Transform from "@/lib/scene/component/Transform";
import type SpriteRenderer from "@/lib/scene/component/SpriteRenderer";

import Transform2DInspectorDrawer from "./fields/Transform2DInspectorDrawer";
import type { IInspectorDrawer } from "./fields/InspectorDrawerBase";

type RegisteredComponent = Transform | 
   SpriteRenderer;

type ComponentType = new (...args : any[]) => RegisteredComponent;
type InspectorDrawerFactory = (target : any, label? : string) => IInspectorDrawer;

const InspectorDrawerMap : Map<ComponentType, InspectorDrawerFactory> = new Map([
   [Transform, (target : Transform, label? : string) => new Transform2DInspectorDrawer(target, label)],
]);

export default InspectorDrawerMap;