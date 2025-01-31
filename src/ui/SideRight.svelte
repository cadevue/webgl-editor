<script lang="ts">
    import { bindedSerializableComponents } from "@/context";
    import SideLayout from "./layouts/SideLayout.svelte";
    import type { ISerializableComponent } from "@/lib/interface/InspectorSerialization";

    /** List of components to render */
    let components : ISerializableComponent[] = $state([]);
    // Derived store to get the field renderers
    let componentRenderers = $derived(components.map((prop) => prop.getFieldRenderer()));

    /** Listen if the components have changed (e.g. new object selected) */
    bindedSerializableComponents.subscribe(() => {
        components = bindedSerializableComponents.get();
    });
</script>

<SideLayout>
    <div class="absolute h-full bg-dark-800 left-0 top-0 w-0.5"></div>
    <h1 class="mb-4">Properties</h1>
    <div class="flex flex-col gap-4">
        <!-- Render all the serializable components -->
        {#each componentRenderers as renderer}
            <renderer.component {...renderer.props} />
        {/each}
    </div>
</SideLayout>