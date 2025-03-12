<script lang="ts">
    import SideLayout from "./layouts/SideLayout.svelte";
    import { EditorController } from "../EditorController";
    import NodeTree from "./components/NodeTree.svelte";

    let rootSceneNode = $state(EditorController.ActiveScene.get()?.root);
    EditorController.ActiveScene.subscribe((scene) => {
        rootSceneNode = scene?.root;
    });

</script>

<SideLayout>
    <div class="flex flex-col gap-8 h-full">
        <div class="absolute h-full bg-dark-800 right-0 top-0 w-0.5"></div>
        <div>
            <h1 class="text-red">Cadeジーエル 2D Editor</h1>
            <p>Made by 
                <a href="https://cadevue.com/" target="_blank" rel="noopener noreferrer">Cadevue</a>
            </p>
        </div>
        <div>
            <p>Scene</p>
            <h1>Sample</h1>
        </div>
        <div>
            <h1 class="mb-2">Hierarchy</h1>
            {#if rootSceneNode}
                {#each rootSceneNode.children as child}
                    <NodeTree node={child} indent={0} />
                {/each}
            {/if}
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