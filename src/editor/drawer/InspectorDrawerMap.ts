import Transform from "@/lib/scene/component/Transform";
import Transform2DInspectorDrawer from "./fields/Transform2DInspectorDrawer";

const InspectorDrawerMap = new Map([
   [Transform, (target : Transform, label? : string) => new Transform2DInspectorDrawer(target, label)],
]);

export default InspectorDrawerMap;