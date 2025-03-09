<script lang="ts">
    import Transform from "@/lib/scene/component/Transform";
    import XYField from "./XYField.svelte";
    import ZField from "./ZField.svelte";

    const { target, label } : { target: Transform, label?: string } = $props();
</script>

<div class="flex flex-col gap-1">
    <h2>{ label || "Transform" }</h2>
    <div class="flex flex-col gap-2">
        <XYField label="Position" target={target.position} />
        <XYField label="Scale" target={target.scale} />
        <ZField label="Rotation" target={target.rotation} dragSpeed={0.1} />
    </div>
</div>