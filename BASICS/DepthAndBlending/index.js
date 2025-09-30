import { gl as GL, makeProgram, makeBuffer } from "webglutils";

/** @type {WebGL2RenderingContext} */
const gl = GL;

const triangle1Data = [
  -0.5, -0.5, .2,// position
  1, 0, 0, 1, // color
  0, -0.5, .2,
  1, 0, 0, 1,
  0, 0.5, .2,
  1, 0, 0, 1,
];

const green = [0, 1, 0];
const triangle2Data = [
  -0.2, -0.2, .5,// position
  ...green, .5, // color
  0.2, -0.2, .5,
  ...green, 1, // color
  0, 0.5, .5,
  ...green, .5,// color
];

const triangle3Data = [
  -.5, -0.2, .8,// position
  0, 0, 1, 1, // color
  -.5, 0.2, .8,
  0, 0, 1, 1,
  .5, 0, .8,
  0, 0, 1, .2,
];


const vertexShaderSource = `
in vec3 position;
in vec4 color;

out vec4 v_color;

void main()
{
    v_color = color;
    gl_Position = vec4(position, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

in vec4 v_color;

uniform bool opaquePass;

out vec4 fragColor;

void main()
{
    if (opaquePass) {
        if (v_color.a < 1.0) {
            discard;
        }
      fragColor = v_color;
    } else {
      if (v_color.a == 1.0) {
        discard;
      }

      fragColor = v_color;
    }

}`;


const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

makeBuffer(new Float32Array([
  ...triangle1Data,
  ...triangle3Data,
  ...triangle2Data,
]));

const positionLocation = gl.getAttribLocation(program, "position");

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);

const colorLocation = gl.getAttribLocation(program, "color");

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);

const opaquePassUniformLocation = gl.getUniformLocation(program, "opaquePass");

// RENDERING
gl.useProgram(program);

gl.clearDepth(0);
gl.clear(gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.GREATER);

gl.enable(gl.BLEND);
gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA);
gl.blendEquation(gl.FUNC_ADD);

gl.uniform1i(opaquePassUniformLocation, true);

gl.drawArrays(gl.TRIANGLES, 0, 3 * 3);

gl.depthMask(false);

gl.uniform1i(opaquePassUniformLocation, false);

gl.drawArrays(gl.TRIANGLES, 0, 3 * 3);