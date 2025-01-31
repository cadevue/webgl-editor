<script lang="ts">
    import { bindedVec } from "@/context";
    import Vector3 from "@/lib/math/Vector3";
    const { label } = $props();

    let vecRef : Vector3 | null = $state(bindedVec.get());

    let x = $state(0);
    let y = $state(0);
    let z = $state(0);

    $effect(() => {
        if (vecRef) {
            vecRef.x = x;
            vecRef.y = y;
            vecRef.z = z;

            console.log("uipos", vecRef);
            // console.log("uidirty", vecRef.dirty);
        }

    });

    bindedVec.subscribe(() => {
        vecRef = bindedVec.value;
    });
</script>

<div class="flex flex-col gap-2">
    <h2>{label}</h2>
    {#if vecRef}
        <input type="number" bind:value={x} class="p-1" />
        <input type="number" bind:value={y} class="p-1" />
        <input type="number" bind:value={z} class="p-1" />
    {:else}
        <p>Vector3 not found</p>
    {/if}
</div>