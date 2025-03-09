<script lang="ts">
    import { EditorController } from "@/editor/EditorController";
    import { onMount } from "svelte";

    import Vector3 from "@/lib/math/Vector3";

    const { target } : { target: Vector3 } = $props();

    let xInput : HTMLInputElement | null = null,
        yInput : HTMLInputElement | null = null;

    let changeMadeByUI = false;
    let isMounted = false;

    function syncUI() {
        xInput!.value = target.x.toFixed(3);
        yInput!.value = target.y.toFixed(3);
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

        xInput?.blur();
        yInput?.blur();

        syncUI();
    });

    onMount(() => {
        isMounted = true;

        syncUI();
    });

    // Application logic listen (subscribe) to changes made by UI
    function handleInputChange() {
        changeMadeByUI = true;

        const x = parseFloat(xInput!.value || "0");
        const y = parseFloat(yInput!.value || "0");

        target.set([x, y, 0]);
    }

    function handleMouseEnter(input: HTMLInputElement) {
        EditorController.SetDragCallback({ dragCallback: e => handleDrag(e, input), cursor: "ew-resize" });
    }

    function handleMouseLeave() {
        EditorController.SetDragCallback({ dragCallback: null });
    }

    function handleDrag(e: MouseEvent, input: HTMLInputElement) {
        input!.value = (parseFloat(input!.value) + e.movementX * 0.01).toFixed(3);
        handleInputChange();
    }
</script>

<div class="flex flex-col gap-1">
    <h3>Position</h3>
    <div class="flex gap-2">
        <div class="flex items-center">
            <label class="text-xs pr-1.5 select-none cursor-ew-resize" for="x"
                onmouseenter={() => handleMouseEnter(xInput!)}
                onmouseleave={handleMouseLeave}
            > X </label>
            <input type="number" class="w-16" step="0.001" id="x" bind:this={xInput} 
                oninput={handleInputChange} onblur={syncUI}
            />
        </div>
        <div class="flex items-center">
            <label class="text-xs pr-1.5 select-none cursor-ew-resize" for="y"
                onmouseenter={() => handleMouseEnter(yInput!)}
                onmouseleave={handleMouseLeave}
            > Y </label>
            <input type="number"  class="w-16" step="0.001" id="y" bind:this={yInput} 
                oninput={handleInputChange} onblur={syncUI} 
            />
        </div>
    </div>
</div>