#type vertex
attribute vec4 a_Position;
attribute vec2 a_TexCoord;

uniform mat4 u_ViewProjection;
uniform mat4 u_Transform;

varying vec2 v_TexCoord;

void main() {
    gl_Position = u_ViewProjection * u_Transform * a_Position;
    v_TexCoord = a_TexCoord;
}

#type fragment
precision mediump float;

uniform sampler2D u_Texture;
uniform vec4 u_Color;

uniform vec2 u_Tiling;
uniform vec2 u_Offset;

varying vec2 v_TexCoord;

void main() {
    vec2 uv_Coord = vec2(v_TexCoord.x, 1.0 - v_TexCoord.y); // Handle Flip
    uv_Coord = uv_Coord * u_Tiling + u_Offset;
    gl_FragColor = texture2D(u_Texture, uv_Coord) * u_Color;
}