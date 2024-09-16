import { gl as GL, makeProgram, makeBuffer } from "webglutils";

/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

const vertexShaderSource = `
in vec2 position;
in vec3 color;

out vec3 vColor;

void main()
{
  vColor = color;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

out vec4 fragColor;

in vec3 vColor;

void main()
{
  fragColor = vec4(vColor, .5);
}`;


const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

makeBuffer(new Float32Array([
  // left triangle
  -1, 1,
  -1, -1,
  1, 1,
  // right triangle
  -1, 1,
  1, -1,
  1, 1,
]));

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

makeBuffer(new Float32Array([
  // left triangle
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  // right triangle
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
]));

const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

// RENDERING
gl.useProgram(program);

gl.clearColor(0, 0, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.blendEquation(gl.FUNC_ADD);

// gl.enable(gl.DEPTH_TEST);

gl.drawArrays(gl.TRIANGLES, 0, 3 * 2);
