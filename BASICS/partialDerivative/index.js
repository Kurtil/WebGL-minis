import { gl, makeProgram, makeBuffer } from "../../webglutils.js";

// Vertex shader
const vertexShaderSource = `#version 300 es
in vec2 a_position;
out vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_position * 0.5 + 0.5; // Map from [-1,1] to [0,1]
}`;

// Fragment shader
const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec2 v_texCoord;
out vec4 outColor;
void main() {
  outColor = vec4(dFdx(v_texCoord.x), dFdy(v_texCoord.y), 0.0, 1.0);
}`;

// Create a program
const program = makeProgram(vertexShaderSource, fragmentShaderSource);

// Define the positions for a full-screen quad
const positions = new Float32Array([
  -1.0, -1.0,
  1.0, -1.0,
  -1.0, 1.0,
  -1.0, 1.0,
  1.0, -1.0,
  1.0, 1.0
]);

makeBuffer(positions);

// Get the location of the a_position attribute
const positionLocation = gl.getAttribLocation(program, 'a_position');

// Tell WebGL how to get data from the position buffer
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

gl.drawArrays(gl.TRIANGLES, 0, 6);