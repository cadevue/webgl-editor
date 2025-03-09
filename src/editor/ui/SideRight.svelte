<script lang="ts">
    import type { IExposableField } from "@/editor/InspectorExpose";

    import SideLayout from "./layouts/SideLayout.svelte";
    import { EditorController } from "../EditorController";

    /** List of components to render */
    let fields : IExposableField[] = $state([]);
    // Derived store to get the field renderers
    let fieldRenderers = $derived(fields.map((prop) => prop.getFieldRenderer()));

    /** Listen if the components have changed (e.g. new object selected) */
    EditorController.ExposedFields.subscribe(() => {
        fields = EditorController.ExposedFields.get();
    });
</script>

<SideLayout>
    <div class="absolute h-full bg-dark-800 left-0 top-0 w-0.5"></div>
    <h1 class="mb-4">Properties</h1>
    <div class="flex flex-col gap-8">
        <!-- Render all the exposable fields -->
        {#each fieldRenderers as renderer}
            <renderer.component {...renderer.props} />
        {/each}
    </div>
</SideLayout>