<script lang="ts">
    import Transform from "@/lib/scene/component/Transform";
    import Vector3Field from "./Vector3Field.svelte";

    const { target, label } : { target: Transform, label?: string } = $props();
</script>

<div class="flex flex-col gap-1">
    <h2>{ label || "Transform" }</h2>
    <div class="flex flex-col gap-2">
        <Vector3Field label="Position" target={target.position} />
        <Vector3Field label="Rotation" target={target.rotation} />
        <Vector3Field label="Scale"    target={target.scale}    />
    </div>
</div>