<script lang="ts">
    import Transform from "@/lib/scene/component/Transform";
    import Vector2Field from "./Vector2Field.svelte";

    const { target, label } : { target: Transform, label?: string } = $props();
</script>

<div class="flex flex-col gap-1">
    <h2>{ label || "Transform" }</h2>
    <div class="flex flex-col gap-2">
        <Vector2Field label="Position" target={target.position} />
        <!-- <Vector2Field label="Rotation" target={target.rotation} /> -->
        <!-- <Vector2Field label="Scale"    target={target.scale}    /> -->
    </div>
</div>