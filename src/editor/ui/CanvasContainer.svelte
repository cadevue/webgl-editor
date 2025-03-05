<script lang="ts">
    import { onMount } from "svelte";

    import EditorApplication from "@/editor/EditorApplication";
    import type Application from "@/lib/app/Application";

    let canvasContainer : HTMLDivElement | null = $state(null);

    function startApp() {
        /** Start Application */
        if (!canvasContainer) {
            throw new Error("Canvas container not found");
        }

        const app : Application = new EditorApplication(canvasContainer); // The editor application
        app.run();
    }

    onMount(() => {
        startApp();
    });
</script>

<div class="flex-1 h-full overflow-hidden bg-dark-500" bind:this={canvasContainer}>
</div>