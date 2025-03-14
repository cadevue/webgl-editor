<script lang="ts">
    import SideLayout from "./layouts/SideLayout.svelte";
    import { EditorController } from "../EditorController";
    import type { IInspectorDrawer } from "../drawer/fields/InspectorDrawerBase";

    /** List of components to render */
    let fields : IInspectorDrawer[] = $state([]);
    // Derived store to get the field renderers
    let fieldRenderers = $derived(fields.map((prop) => prop.getFieldRenderer()));
    let selectedNode = $state(EditorController.SelectedNode.get());

    /** Listen if the components have changed (e.g. new object selected) */
    EditorController.ExposedFields.subscribe(() => {
        fields = EditorController.ExposedFields.get();
    });
    EditorController.SelectedNode.subscribe(() => {
        selectedNode = EditorController.SelectedNode.get();
    });

    $inspect(fieldRenderers);
</script>

<SideLayout>
    <div class="absolute h-full bg-dark-800 left-0 top-0 w-0.5"></div>
    <h1 class="mb-4">Properties</h1>
    <h2>{selectedNode?.name}</h2>
    <div class="flex flex-col gap-8">
        {#each fieldRenderers as renderer (selectedNode?.id)}
            <renderer.component {...renderer.props} />
        {/each}
    </div>
</SideLayout>