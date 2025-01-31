<script lang="ts">
    import type Transform from "@/lib/scene/component/Transform";
    import Vec3Field from "./Vec3Field.svelte";

    const { transform } : { transform: Transform } = $props();
</script>

<div>
    <h2>Camera Transform</h2>
    <Vec3Field label="Position" bindedVec3={transform.position} />
    <Vec3Field label="Rotation" bindedVec3={transform.rotation} />
    <Vec3Field label="Scale" bindedVec3={transform.scale} />
</div>