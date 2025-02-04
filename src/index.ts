import { mount } from 'svelte'
import Editor from './editor/Editor.svelte'

const app = mount(Editor, {
  target: document.getElementById('app')!,
})

export default app
