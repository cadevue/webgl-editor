<script lang="ts">
    import type SceneNode from "@/lib/scene/SceneNode";
    import NodeTree from "./NodeTree.svelte";
    import { ChevronRight, ChevronDown } from "@lucide/svelte";
    import { EditorController } from "@/editor/EditorController";
    import { onMount } from "svelte";

    const { node, indent } : { node: SceneNode, indent: number } = $props();
    let isExpanded = $state(false);
    let isSelected = $state(EditorController.SelectedNode.get() === node);
    let isHovered = $state(false);

    onMount(() => {
        EditorController.SelectedNode.subscribe((selectedNode) => {
            isSelected = selectedNode === node;
        });
    });
</script>

<div class="flex flex-col" style="margin-left: {indent * 1}rem;">
    <div class="flex gap-1">
        {#if node.children.length > 0}
            <button class="text-xs text-light cursor-pointer" onclick={() => isExpanded = !isExpanded}>
                {#if isExpanded}
                    <ChevronDown size={12} />
                {:else}
                    <ChevronRight size={12} />
                {/if}
            </button>
        {/if}
        <button class={`flex items-center gap-1 px-1.5 py-1 rounded-md w-full
            ${isHovered || isSelected ? 'bg-dark-800' : ''} `}
            onmouseenter={() => isHovered = true}
            onmouseleave={() => isHovered = false}
            role="treeitem"
            aria-selected={isSelected}
            aria-expanded={node.children.length > 0 && isExpanded}
            tabindex={indent}
            onclick={() => EditorController.SelectedNode.set(node)}
        >
            <span class="text-xs text-light" >{node.name}</span>
        </button>
    </div>
    {#if node.children.length > 0 && isExpanded}
        {#each node.children as child}
            <NodeTree node={child} indent={indent + 1} />
        {/each}
    {/if}
</div>