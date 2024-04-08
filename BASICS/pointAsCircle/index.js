import { gl, makeProgram } from "webglutils";

const vertexShaderSource = `
void main()
{
    gl_PointSize = 300.0;
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

out vec4 fragColor;

void main()
{
    // gl_PointCoord contains the coordinate of a fragment within a point

    vec2 centeredPointCoord = gl_PointCoord - vec2(0.5, 0.5);
    float distance = length(centeredPointCoord);
    if (distance > 0.5) {
        discard;
    }
    fragColor = vec4(gl_PointCoord, 0.0, 1.0);
}`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

gl.useProgram(program);

gl.drawArrays(gl.POINTS, 0, 1);