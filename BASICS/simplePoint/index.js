import { gl, makeProgram } from "webglutils";

const vertexShaderSource = `
void main()
{
  // gl_PointSize = 10.0;
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

out vec4 fragColor;

void main()
{
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

gl.viewport(240, 240, 260, 260);

gl.useProgram(program);

gl.drawArrays(gl.POINTS, 0, 1);