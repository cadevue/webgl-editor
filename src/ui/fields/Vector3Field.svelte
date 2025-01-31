<script lang="ts">
    import Vector3 from "@/lib/math/Vector3";

    const { label, target } : { label: string, target: Vector3 } = $props();

    let x = $state(target.x);
    let y = $state(target.y);
    let z = $state(target.z);

    /** 2-way binding */
    target.subscribe(() => {
        x = parseFloat(target.x.toFixed(3));
        y = parseFloat(target.y.toFixed(3));
        z = parseFloat(target.z.toFixed(3));
    });

    $effect(() => {
        target.x = x;
        target.y = y;
        target.z = z;
    });
</script>

<div class="flex flex-col gap-2">
    <h2>{label}</h2>
    <div class="flex gap-2 items-center">
        <label class="text-xs" for="x">X</label>
        <input type="number" bind:value={x} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="x" />
    </div>
    <div class="flex gap-2 items-center">
        <label class="text-xs" for="y">Y</label>
        <input type="number" bind:value={y} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="y" />
    </div>
    <div class="flex gap-2 items-center">
        <label class="text-xs" for="z">Z</label>
        <input type="number" bind:value={z} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="z" />
    </div>
</div>