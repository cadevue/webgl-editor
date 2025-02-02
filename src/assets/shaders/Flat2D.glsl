#type vertex
attribute vec4 a_Position;

uniform mat4 u_ViewProjection;
uniform mat4 u_Transform;

void main() {
    gl_Position = u_ViewProjection * u_Transform * a_Position;
}

#type fragment
precision mediump float;

uniform vec4 u_Color;

void main() {
    gl_FragColor = u_Color;
}