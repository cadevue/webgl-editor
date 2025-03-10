<script lang="ts">
    import { EditorController } from "@/editor/EditorController";
    import { onMount } from "svelte";
    import { Link, Unlink } from '@lucide/svelte';

    import Vector3 from "@/lib/math/Vector3";

    const { target } : { target: Vector3 } = $props();

    let xInput : HTMLInputElement,
        yInput : HTMLInputElement;

    let changeMadeByUI = false;
    let isMounted = false;
    let isAspectRatioLocked = $state(false);
    let aspectRatio = 1;

    function syncUI() {
        xInput.value = target.x.toFixed(3);
        yInput.value = target.y.toFixed(3);
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
    function handleInputChange(input: HTMLInputElement) {
        changeMadeByUI = true;
        let x = target.x;
        let y = target.y;

        switch (input) {
            case xInput:
                x = parseFloat(xInput.value || "0");
                if (isAspectRatioLocked) {
                    y = x / aspectRatio;
                    yInput.value = y.toFixed(3);
                }

                break;
            case yInput:
                y = parseFloat(yInput.value || "0");
                if (isAspectRatioLocked) {
                    x = y * aspectRatio;
                    xInput.value = x.toFixed(3);
                }
                break;
        }

        target.set([x, y, 0]);
    }

    function handleMouseEnter(input: HTMLInputElement) {
        EditorController.SetDragCallback({ dragCallback: e => handleDrag(e, input), cursor: "ew-resize" });
    }

    function handleMouseLeave() {
        EditorController.SetDragCallback({ dragCallback: null });
    }

    function handleDrag(e: MouseEvent, input: HTMLInputElement) {
        input.value = (parseFloat(input.value) + e.movementX * 0.01).toFixed(3);
        handleInputChange(input);
    }

    function handleLockAspectRatio() {
        isAspectRatioLocked = !isAspectRatioLocked;
        if (isAspectRatioLocked) {
            aspectRatio = target.x / target.y;
        }
    }
</script>

<div class="flex flex-col gap-1">
    <h3>Scale</h3>
    <div class="flex gap-2">
        <div class="flex items-center">
            <label class="text-xs pr-1.5 select-none cursor-ew-resize" for="x"
                onmouseenter={() => handleMouseEnter(xInput)}
                onmouseleave={handleMouseLeave}
            > X </label>
            <input type="number" class="w-16" step="0.001" id="x" bind:this={xInput} 
                oninput={() => handleInputChange(xInput)} onblur={syncUI}
            />
        </div>
        <div class="flex items-center">
            <label class="text-xs pr-1.5 select-none cursor-ew-resize" for="y"
                onmouseenter={() => handleMouseEnter(yInput)}
                onmouseleave={handleMouseLeave}
            > Y </label>
            <input type="number"  class="w-16" step="0.001" id="y" bind:this={yInput} 
                oninput={() => handleInputChange(yInput)} onblur={syncUI}
            />
        </div>
        <button class={`text-light ml-1 px-1.5 text-xs rounded-md font-mono 
            cursor-pointer hover:bg-dark-800 hover:text-light ${isAspectRatioLocked && 'bg-dark-800'}`}
            onclick={handleLockAspectRatio}
        >
            {#if isAspectRatioLocked}
                <Unlink size=16 />
            {:else}
                <Link size=16 />
            {/if}
        </button>
    </div>
</div> 
