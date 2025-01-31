<script lang="ts">
    import type Transform from "@/lib/scene/component/Transform";
    import Vec3Field from "./Vec3Field.svelte";

    const { transform } : { transform: Transform } = $props();
</script>

<div>
    <h1>Camera Transform</h1>
    <Vec3Field label="Position" bindedValue={transform.position} />
    <Vec3Field label="Rotation" bindedValue={transform.rotation} />
    <Vec3Field label="Scale"    bindedValue={transform.scale} />
</div>