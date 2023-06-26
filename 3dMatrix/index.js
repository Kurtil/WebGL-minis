import { create, scale, translate } from "./mat3.js";

const canvas = document.getElementById("canvas");
/** @type { WebGL2RenderingContext } */
const gl = canvas.getContext("webgl2");

// css pixel coordinates
const positions = new Float32Array([
  100, 100, 300, 300, 300, 100, 100, 100, 100, 300, 300, 300,
]);

const vertexShaderSource = `\
#version 300 es
in vec2 position;

uniform mat3 projection;

void main() {
   gl_Position = vec4(projection * vec3(position, 1), 1);
}
`;

const fragmentShaderSource = `\
#version 300 es
precision highp float;
 
out vec4 outColor; 
 
void main() {
   outColor = vec4(0, 1, 1, 1);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader));
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader));
}

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}

const positionLocation = gl.getAttribLocation(program, "position");
const projectionLocation = gl.getUniformLocation(program, "projection");

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

const projectionMatrix = create();

// invert Y
scale(projectionMatrix, projectionMatrix, [1, -1]);
//  [-1, 1] to [0, 2]
translate(projectionMatrix, projectionMatrix, [-1, -1]);
// [0, 2] to [0, 1]
scale(projectionMatrix, projectionMatrix, [2, 2]);
// [0, 1] to css pixel
scale(projectionMatrix, projectionMatrix, [
  1 / gl.drawingBufferWidth,
  1 / gl.drawingBufferHeight,
]);
// equivalent to mat3 projection

gl.uniformMatrix3fv(projectionLocation, false, projectionMatrix);

gl.clearColor(0.5, 0.5, 0.5, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3);