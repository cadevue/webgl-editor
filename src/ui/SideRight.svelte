<script lang="ts">
    import Vector3Field from "./components/Vector3Field.svelte";
    import SideLayout from "./layouts/SideLayout.svelte";
</script>

<SideLayout>
    <div class="absolute h-full bg-dark-800 left-0 top-0 w-0.5"></div>
    <h1 class="mb-4">Properties</h1>
    <Vector3Field label="Position" />
</SideLayout>