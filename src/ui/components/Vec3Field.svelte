<script lang="ts">
    import Vector3 from "@/lib/math/Vector3";

    const { label, bindedVec3 } : { label: string, bindedVec3: Vector3 } = $props();

    let x = $state(bindedVec3.x);
    let y = $state(bindedVec3.y);
    let z = $state(bindedVec3.z);

    $effect(() => {
        bindedVec3.x = x;
        bindedVec3.y = y;
        bindedVec3.z = z;
    });
</script>

<div class="flex flex-col gap-2">
    <h2>{label}</h2>
    <input type="number" bind:value={x} class="p-1" />
    <input type="number" bind:value={y} class="p-1" />
    <input type="number" bind:value={z} class="p-1" />
</div>