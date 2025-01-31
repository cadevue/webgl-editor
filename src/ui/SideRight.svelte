<script lang="ts">
    import { bindedProperties } from "@/context";
    import SideLayout from "./layouts/SideLayout.svelte";
    import type { IExposableComponent } from "@/lib/interface/Exposable";

    let properties : IExposableComponent[] = $state([]);
    let propertyFieldComponents = $derived(properties.map((prop) => prop.createInspectorField()));

    bindedProperties.subscribe(() => {
        properties = bindedProperties.get();
        console.log("New properties bounded", properties);
    });
</script>

<SideLayout>
    <div class="absolute h-full bg-dark-800 left-0 top-0 w-0.5"></div>
    <h1 class="mb-4">Properties</h1>
    {#each propertyFieldComponents as prop}
        <prop.component />
    {/each}
</SideLayout>