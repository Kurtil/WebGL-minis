import { gl as GL, makeProgram } from "webglutils";
/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

const LINE_WIDTH = 20;

import { rotation, multiply } from "../../../utils/math/mat3.js";
import vertexShaderSource from "./shaders/vertex.js";
import fragmentShaderSource from "./shaders/fragment.js";

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const matrixLocation = gl.getUniformLocation(program, "matrix");

const positions = new Float32Array([
  0, 0,
  // .5, 0,
  200, 0,
]);

const pointCount = positions.length / 2;

const positionTexture = gl.createTexture();
const positionTextureLocation = gl.getUniformLocation(program, "positionTexture");
const positionTextureUnit = 4;
gl.activeTexture(gl.TEXTURE0 + positionTextureUnit);
gl.bindTexture(gl.TEXTURE_2D, positionTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32F, pointCount, 1);
gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, pointCount, 1, gl.RG, gl.FLOAT, positions);

gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

const lineWidthLocation = gl.getUniformLocation(program, "line_width");

let angle = 0;

const projectionMatrix = [
  2 / gl.drawingBufferWidth, 0, 0,
  0, -2 / gl.drawingBufferHeight, 0,
  -1, 1, 1,
];
const translationMatrix = [
  1, 0, 0,
  0, 1, 0,
  gl.drawingBufferWidth / 2, gl.drawingBufferHeight / 2, 1,
];

gl.useProgram(program);

gl.uniform1f(lineWidthLocation, LINE_WIDTH);

function draw() {
  angle += 0.1;

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  const rotationMatrix = rotation((angle / 180) * Math.PI);

  gl.uniformMatrix3fv(
    matrixLocation,
    false,
    multiply(rotationMatrix, multiply(translationMatrix, projectionMatrix))
  );

  gl.uniform1i(positionTextureLocation, positionTextureUnit);

  gl.clearColor(0, 0, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, pointCount * 2);

  requestAnimationFrame(draw);
}

draw();
