<script lang="ts">
    import Vector3 from "@/lib/math/Vector3";

    const { label, target } : { label?: string, target: Vector3 } = $props();

    // Temporary solution
    let xInput : HTMLInputElement | null = null,
        yInput : HTMLInputElement | null = null,
        zInput : HTMLInputElement | null = null;

    let x = $state(target.x);
    let y = $state(target.y);
    let z = $state(target.z);

    /** 2-way binding */
    target.subscribe(() => {
        xInput?.blur();
        yInput?.blur();
        zInput?.blur();

        // UI listen (subscribe) to changes made by application logic (target)
        x = parseFloat(target.x.toFixed(3));
        y = parseFloat(target.y.toFixed(3));
        z = parseFloat(target.z.toFixed(3));
    });

    $effect(() => {
        // Application logic (target) listen to changes made by UI through state & effect
        target.x = x;
        target.y = y;
        target.z = z;
    });
</script>

<div class="flex flex-col gap-1">
    <h3>{label || "Vector3"}</h3>
    <div class="flex gap-1">
        <div class="flex gap-1 items-center">
            <label class="text-xs" for="x">X</label>
            <input type="number" bind:value={x} class="p-1 text-xs w-12 rounded-sm bg-light" step="0.025" id="x" bind:this={xInput} />
        </div>
        <div class="flex gap-1 items-center">
            <label class="text-xs" for="y">Y</label>
            <input type="number" bind:value={y} class="p-1 text-xs w-12 rounded-sm bg-light" step="0.025" id="y" bind:this={yInput} />
        </div>
        <div class="flex gap-1 items-center">
            <label class="text-xs" for="z">Z</label>
            <input type="number" bind:value={z} class="p-1 text-xs w-12 rounded-sm bg-light" step="0.025" id="z" bind:this={zInput} />
        </div>
    </div>
</div>