import { renderContext } from "@/renderContext";

/** Automatic Cleanup Management for WebGL Resources */
type WebGLResource =
    | WebGLBuffer
    | WebGLProgram
    | WebGLTexture
    | WebGLFramebuffer
    | WebGLRenderbuffer
    | WebGLVertexArrayObject;

type WebGLResourceType = new (...args: any[]) => WebGLResource;
const glResourceRegistries = new Map<WebGLResourceType, FinalizationRegistry<WebGLResource>>();

function getOrCreateRegistry<T extends WebGLResource>(
    resourceType: new (...args: any[]) => T,
    deleteFn: (gl: WebGL2RenderingContext, resource: T) => void
) {
    const gl = renderContext.getWebGLRenderingContext();
    if (!glResourceRegistries.has(resourceType)) {
        const registry = new FinalizationRegistry<T>((resource) => {
            deleteFn(gl, resource);
        });

        glResourceRegistries.set(resourceType, registry);
    }
    return glResourceRegistries.get(resourceType)!;
}

// Function to register a WebGL resource for automatic cleanup
function registerResource<T extends WebGLResource>(
    owner: any,
    resource: T
) {
    const gl = renderContext.getWebGLRenderingContext();
    const type = resource.constructor as new (...args: any[]) => T;

    // Determine the correct deletion function
    const deleteFnMap = new Map<WebGLResourceType, (gl: WebGL2RenderingContext, resource: WebGLResource) => void>([
        [WebGLBuffer, (gl, res) => gl.deleteBuffer(res as WebGLBuffer)],
        [WebGLProgram, (gl, res) => gl.deleteProgram(res as WebGLProgram)],
        [WebGLTexture, (gl, res) => gl.deleteTexture(res as WebGLTexture)],
        [WebGLFramebuffer, (gl, res) => gl.deleteFramebuffer(res as WebGLFramebuffer)],
        [WebGLRenderbuffer, (gl, res) => gl.deleteRenderbuffer(res as WebGLRenderbuffer)],
        [WebGLVertexArrayObject, (gl, res) => gl.deleteVertexArray(res as WebGLVertexArrayObject)]
    ]);

    const deleteFn = deleteFnMap.get(type);
    if (!deleteFn) {
        console.warn(`No delete function found for ${type.name}`);
        return;
    }

    const registry = getOrCreateRegistry(type, deleteFn);
    registry.register(owner, resource);
}

// WebGL Resource Management
// Automatically clean up WebGL resources when they are no longer needed using FinalizationRegistry
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
const GLResourceManager = {
    registerResource
} as const;

export default GLResourceManager;