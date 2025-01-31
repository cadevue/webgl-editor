<script lang="ts">
    import Vector3 from "@/lib/math/Vector3";

    const { label, bindedValue } : { label: string, bindedValue: Vector3 } = $props();

    let x = $state(bindedValue.x);
    let y = $state(bindedValue.y);
    let z = $state(bindedValue.z);

    $effect(() => {
        x = bindedValue.x;
        y = bindedValue.y;
        z = bindedValue.z;
    });
</script>

<div class="flex flex-col gap-2">
    <h2>{label}</h2>
    <input type="number" bind:value={x} class="p-1" />
    <input type="number" bind:value={y} class="p-1" />
    <input type="number" bind:value={z} class="p-1" />
</div>