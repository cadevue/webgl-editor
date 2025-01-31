<script lang="ts">
    import { bindedComponents } from "@/context";
    import SideLayout from "./layouts/SideLayout.svelte";
    import type { ISerializableComponent } from "@/lib/interface/InspectorAPI";

    let components : ISerializableComponent[] = $state([]);
    let componentRenderers = $derived(components.map((prop) => prop.getFieldRenderer()));

    bindedComponents.subscribe(() => {
        components = bindedComponents.get();
    });
</script>

<SideLayout>
    <div class="absolute h-full bg-dark-800 left-0 top-0 w-0.5"></div>
    <h1 class="mb-4">Properties</h1>
    {#each componentRenderers as renderer}
        <renderer.component {...renderer.props} />
    {/each}
</SideLayout>