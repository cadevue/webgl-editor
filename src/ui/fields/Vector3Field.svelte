<script lang="ts">
    import Vector3 from "@/lib/math/Vector3";

    const { label, bindedValue } : { label: string, bindedValue: Vector3 } = $props();

    let x = $state(bindedValue.x);
    let y = $state(bindedValue.y);
    let z = $state(bindedValue.z);

    $effect(() => {
        bindedValue.x = x;
        bindedValue.y = y;
        bindedValue.z = z;
    });
</script>

<div class="flex flex-col gap-2">
    <h2>{label}</h2>
    <div class="flex gap-2">
        <label class="text-xs" for="x">X</label>
        <input type="number" bind:value={x} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="x" />
    </div>
    <div class="flex gap-2">
        <label class="text-xs" for="y">Y</label>
        <input type="number" bind:value={y} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="y" />
    </div>
    <div class="flex gap-2">
        <label class="text-xs" for="z">Z</label>
        <input type="number" bind:value={z} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="z" />
    </div>
</div>