import WebGLUtils from "../webglutils.js";

const gl = WebGLUtils.gl;

const vertexShaderSource = `\
#version 300 es
in vec2 position;

uniform vec2 resolution;

void main() {
  vec2 zeroToOne = position / resolution;
  vec2 clipSpace = zeroToOne * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0, 1);

  gl_PointSize = 1.0;
}
`;

const fragmentShaderSource = `\
#version 300 es
precision highp float;
 
out vec4 outColor; 
 
void main() {
  outColor = vec4(1, 0, 0, 1);
}
`;

const program = WebGLUtils.makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const positionLocation = gl.getAttribLocation(program, "position");
const resolutionLocation = gl.getUniformLocation(program, "resolution");

const positionBuffer = gl.createBuffer();

const positions = new Float32Array([
  1, 1,
  2, 2,
  3, 3,
  4, 4,
  5, 5,
  6, 6,
  7, 7,
  8, 8,
  9, 9,
  10, 10,
  1, 10,
  2, 9,
  3, 8,
  4, 7,
  5, 6,
  6, 5,
  7, 4,
  8, 3,
  9, 2,
  10, 1,
]);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

const gridSize = 10;

gl.canvas.width = gridSize;
gl.canvas.height = gridSize;

gl.uniform2f(resolutionLocation, gridSize, gridSize);

// gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.viewport(3, 3, gl.drawingBufferWidth / 2, gl.drawingBufferHeight / 2);

gl.clearColor(0.9, 0.9, 0.9, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, positions.length / 2);