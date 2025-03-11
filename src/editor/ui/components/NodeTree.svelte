<script lang="ts">
    import type SceneNode from "@/lib/scene/SceneNode";
    import NodeTree from "./NodeTree.svelte";

    const { node, indent } : { node: SceneNode, indent: number } = $props();
</script>

<div class="flex flex-col gap-2">
    <div class="flex items-center gap-1" style="margin-left: {indent * 2}rem;">
        <span class="text-sm text-light">{node.name}</span>
    </div>
    {#if node.children.length > 0}
        {#each node.children as child}
            <NodeTree node={child} indent={indent + 1} />
        {/each}
    {/if}
</div>