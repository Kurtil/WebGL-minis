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
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.useProgram(program);

gl.drawArrays(gl.POINTS, 0, 1);