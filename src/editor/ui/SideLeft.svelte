<script>
    import SideLayout from "./layouts/SideLayout.svelte";
</script>

<SideLayout>
    <div class="flex flex-col gap-8 h-full">
        <div class="absolute h-full bg-dark-800 right-0 top-0 w-0.5"></div>
        <div>
            <h1 class="text-red">Webジーエル Engine</h1>
            <p>made by 
                <a href="https://cadevue.com/" target="_blank" rel="noopener noreferrer">Cadevue</a>
            </p>
        </div>
        <div>
            <p>Scene</p>
            <h1>Untitled</h1>
        </div>
        <div>
            <h1>Hierarchy</h1>
        </div>
        <p class="absolute bottom-8 text-wrap left-6 right-6">
            <b>Credits</b>:<br> 
            This implementation was based on 
            <a href="https://www.youtube.com/watch?v=JxIZbV_XjAs&list=PLlrATfBNZ98dC-V-N3m0Go4deliWHPFwT"
             class="underline hover:text-red" target="_blank" rel="noopener noreferrer"
            >
            The Cherno's Game Engine Series
        </a>. Do check it out!
        </p>
    </div>
</SideLayout>