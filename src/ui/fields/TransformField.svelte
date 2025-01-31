<script lang="ts">
    import type Transform from "@/lib/scene/component/Transform";
    import Vector3Field from "./Vector3Field.svelte";

    const { transform } : { transform: Transform } = $props();
</script>

<div>
    <h1>Camera Transform</h1>
    <Vector3Field label="Position" bindedValue={transform.position} />
    <Vector3Field label="Rotation" bindedValue={transform.rotation} />
    <Vector3Field label="Scale"    bindedValue={transform.scale}    />
</div>