export type ShaderSource = Map<GLenum, string>;

export enum ShaderDataType {
    Float, Float2, Float3, Float4,
    Mat3, Mat4,
    Int, Int2, Int3, Int4,
    Bool
}

export function getSizeOfShaderDataType(type : ShaderDataType) {
    switch (type) {
        case ShaderDataType.Float:      return 4;
        case ShaderDataType.Float2:     return 4 * 2;
        case ShaderDataType.Float3:     return 4 * 3;
        case ShaderDataType.Float4:     return 4 * 4;
        case ShaderDataType.Mat3:       return 4 * 3 * 3;
        case ShaderDataType.Mat4:       return 4 * 4 * 4;
        case ShaderDataType.Int:        return 4;
        case ShaderDataType.Int2:       return 4 * 2;
        case ShaderDataType.Int3:       return 4 * 3;
        case ShaderDataType.Int4:       return 4 * 4;
        case ShaderDataType.Bool:       return 1;
    }
}

export function getCountOfShaderDataType(type : ShaderDataType) {
    switch (type) {
        case ShaderDataType.Float:      return 1;
        case ShaderDataType.Float2:     return 2;
        case ShaderDataType.Float3:     return 3;
        case ShaderDataType.Float4:     return 4;
        case ShaderDataType.Mat3:       return 3 * 3;
        case ShaderDataType.Mat4:       return 4 * 4;
        case ShaderDataType.Int:        return 1;
        case ShaderDataType.Int2:       return 2;
        case ShaderDataType.Int3:       return 3;
        case ShaderDataType.Int4:       return 4;
        case ShaderDataType.Bool:       return 1;
    }
}

export function shaderDataTypeToString(type : ShaderDataType) {
    return ShaderDataType[type];
}

export function shaderDataTypeToGLType(type : ShaderDataType) {
    switch (type) {
        case ShaderDataType.Float:      return WebGL2RenderingContext.FLOAT;
        case ShaderDataType.Float2:     return WebGL2RenderingContext.FLOAT;
        case ShaderDataType.Float3:     return WebGL2RenderingContext.FLOAT;
        case ShaderDataType.Float4:     return WebGL2RenderingContext.FLOAT;
        case ShaderDataType.Mat3:       return WebGL2RenderingContext.FLOAT;
        case ShaderDataType.Mat4:       return WebGL2RenderingContext.FLOAT;
        case ShaderDataType.Int:        return WebGL2RenderingContext.INT;
        case ShaderDataType.Int2:       return WebGL2RenderingContext.INT;
        case ShaderDataType.Int3:       return WebGL2RenderingContext.INT;
        case ShaderDataType.Int4:       return WebGL2RenderingContext.INT;
        case ShaderDataType.Bool:       return WebGL2RenderingContext.BOOL;
    }
}