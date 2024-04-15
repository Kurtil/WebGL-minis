import { gl as GL, makeProgram, makeBuffer } from "webglutils";

/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

const vertexShaderSource = `
in vec2 position;

void main()
{
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

out vec4 fragColor;

uniform vec3 color;

void main()
{
  fragColor = vec4(color, 1);
}`;


const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

makeBuffer(new Float32Array([
  -0.5, -0.5,
  0.5, -0.5,
  0, 0.5,
]));

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getUniformLocation(program, "color");

// RENDERING
gl.useProgram(program);

gl.enable(gl.STENCIL_TEST);
gl.clear(gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Set the stencil test so it always passes
// and the reference to 1
gl.stencilFunc(
  gl.ALWAYS,    // the test
  1,            // reference value
  0xFF,         // mask
);
// Set it so we replace with the reference value (1)
gl.stencilOp(
  gl.KEEP,     // what to do if the stencil test fails
  gl.KEEP,     // what to do if the depth test fails
  gl.REPLACE,  // what to do if both tests pass
);

gl.uniform3f(colorLocation, 1, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 3);

// Set the test that the stencil must = 0
gl.stencilFunc(
  gl.EQUAL,     // the test
  0,            // reference value
  0xFF,         // mask
);
// don't change the stencil buffer on draw
gl.stencilOp(
  gl.KEEP,     // what to do if the stencil test fails
  gl.KEEP,     // what to do if the depth test fails
  gl.KEEP,  // what to do if both tests pass
);

gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
  -1, -1,
  1, -1,
  0, 1,
]));

gl.uniform3f(colorLocation, 0, 1, 0);

gl.drawArrays(gl.TRIANGLES, 0, 3);
