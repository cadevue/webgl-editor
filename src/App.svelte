<script>
    import MainCanvas from "./lib/MainCanvas.svelte";
    import SideLeft from "./lib/SideLeft.svelte";
    import SideRight from "./lib/SideRight.svelte";
</script>

<main class="flex h-full">
    <SideLeft />
    <MainCanvas />
    <SideRight />
</main>