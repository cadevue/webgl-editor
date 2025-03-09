<script lang="ts">
    import Transform from "@/lib/scene/component/Transform";
    import PositionField from "./PositionField.svelte";
    import ScaleField from "./ScaleField.svelte";
    import RotationField from "./RotationField.svelte";

    const { target, label } : { target: Transform, label?: string } = $props();
</script>

<div class="flex flex-col gap-1">
    <h2>{ label || "Transform" }</h2>
    <div class="flex flex-col gap-2">
        <PositionField target={target.position} />
        <ScaleField target={target.scale} />
        <RotationField target={target.rotation} dragSpeed={0.1} />
    </div>
</div>