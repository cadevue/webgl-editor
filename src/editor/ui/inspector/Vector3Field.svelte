<script lang="ts">
    import Vector3 from "@/lib/math/Vector3";
  import { onMount } from "svelte";

    const { label, target } : { label?: string, target: Vector3 } = $props();

    // Temporary solution
    let xInput : HTMLInputElement | null = null,
        yInput : HTMLInputElement | null = null,
        zInput : HTMLInputElement | null = null;

    let changeMadeByUI = $state(false);
    let mounted = $state(false);

    function syncUI() {
        console.log("syncUI", target.x, target.y, target.z);

        xInput!.value = target.x.toFixed(2);
        yInput!.value = target.y.toFixed(2);
        zInput!.value = target.z.toFixed(2);
    }

    /** 2-way binding */
    // UI listen (subscribe) to changes made by application logic (target)
    target.subscribe(() => {
        if (!mounted) { return; }

        // Ignore changes made by UI propagated back by the application logic
        if (changeMadeByUI) {
            changeMadeByUI = false;
            return;
        }

        xInput?.blur();
        yInput?.blur();
        zInput?.blur();

        syncUI();
    });

    onMount(() => {
        mounted = true;

        syncUI();
    });

    // Application logic listen (subscribe) to changes made by UI
    function handleInputChange() {
        changeMadeByUI = true;

        const x = parseFloat(xInput!.value || "0");
        const y = parseFloat(yInput!.value || "0");
        const z = parseFloat(zInput!.value || "0");

        target.set([x, y, z]);
    }
</script>

<div class="flex flex-col gap-1">
    <h3>{label || "Vector3"}</h3>
    <div class="flex gap-2">
        <div class="flex gap-1 items-center">
            <label class="text-xs" for="x">X</label>
            <input type="number" class="w-14" step="0.025" id="x" bind:this={xInput} oninput={handleInputChange} onblur={syncUI} />
        </div>
        <div class="flex gap-1 items-center">
            <label class="text-xs" for="y">Y</label>
            <input type="number"  class="w-14" step="0.025" id="y" bind:this={yInput} oninput={handleInputChange} onblur={syncUI} />
        </div>
        <div class="flex gap-1 items-center">
            <label class="text-xs" for="z">Z</label>
            <input type="number" class="w-14" step="0.025" id="z" bind:this={zInput} oninput={handleInputChange} onblur={syncUI} />
        </div>
    </div>
</div>