const simple2DWithCamera = {
    vertex : `
        attribute vec4 a_Position;
        attribute vec4 a_Color;

        varying vec4 v_Color;

        void main() {
            gl_Position = a_Position;
            v_Color = a_Color;
        }
    `,
    fragment : `
        precision mediump float;

        varying vec4 v_Color;

        void main() {
            gl_FragColor = v_Color;
        }
    `
};
export default simple2DWithCamera;