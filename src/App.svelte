<script>
    import MainCanvas from "./ui/MainCanvas.svelte";
    import SideLeft from "./ui/SideLeft.svelte";
    import SideRight from "./ui/SideRight.svelte";
</script>

<main class="flex h-full">
    <SideLeft />
    <MainCanvas />
    <SideRight />
</main>