<script lang="ts">
    import { EditorController } from "@/editor/EditorController";
    import { onMount } from "svelte";

    import Vector3 from "@/lib/math/Vector3";

    const { label, target, dragSpeed : propsDragSpeed } : { label?: string, target: Vector3, dragSpeed?: number } = $props();

    let zInput : HTMLInputElement | null = null;

    let changeMadeByUI = false;
    let isMounted = false;
    const dragSpeed = propsDragSpeed || 0.01;

    function syncUI() {
        zInput!.value = target.z.toFixed(3);
    }

    /** 2-way binding */
    // UI listen (subscribe) to changes made by application logic (target)
    target.subscribe(() => {
        if (!isMounted) { return; }

        // Ignore changes made by UI propagated back by the application logic
        if (changeMadeByUI) {
            changeMadeByUI = false;
            return;
        }

        zInput?.blur();
        syncUI();
    });

    onMount(() => {
        isMounted = true;

        syncUI();
    });

    // Application logic listen (subscribe) to changes made by UI
    function handleInputChange() {
        changeMadeByUI = true;

        const z = parseFloat(zInput!.value || "0");

        target.set([0, 0, z]);
    }

    function handleMouseEnter(input: HTMLInputElement) {
        EditorController.SetDragCallback({ dragCallback: e => handleDrag(e, input), cursor: "ew-resize" });
    }

    function handleMouseLeave() {
        EditorController.SetDragCallback({ dragCallback: null });
    }

    function handleDrag(e: MouseEvent, input: HTMLInputElement) {
        input!.value = (parseFloat(input!.value) + e.movementX * dragSpeed).toFixed(3);
        handleInputChange();
    }
</script>

<div class="flex flex-col gap-1">
    <h3>{label || "Z Field"}</h3>
    <div class="flex">
        <div class="flex items-center">
            <label class="text-xs pr-1.5 select-none cursor-ew-resize" for="x"
                onmouseenter={() => handleMouseEnter(zInput!)}
                onmouseleave={handleMouseLeave}
            > Z </label>
            <input type="number" class="w-16" step="0.001" id="x" bind:this={zInput}
                oninput={handleInputChange} onblur={syncUI}
            />
        </div>
    </div>
</div>