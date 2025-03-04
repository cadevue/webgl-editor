<script lang="ts">
    import type Observable from "@/lib/math/Observable";

    const { target, label } : { target: Observable<number>, label?: string } = $props();

    let value = $state(target.value);

    /** 2-way binding */
    target.subscribe(() => {
        value = parseFloat(target.value.toFixed(3));
    });

    $effect(() => {
        // Application logic (target) listen to changes made by UI through state & effect
        target.value = value;
    });
</script>

<div class="flex flex-col gap-1">
    <label class="text-xs" for="value">{ label || "Value" }</label>
    <div class="flex gap-2 items-center">
        <input type="number" bind:value={value} class="p-1 text-xs w-2/3 rounded-sm" step="0.025" id="value"/>
    </div>
</div>