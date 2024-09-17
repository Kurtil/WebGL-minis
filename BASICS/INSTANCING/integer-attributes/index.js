import { gl as GL, makeProgram, makeBuffer } from "webglutils";
/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

const SQUARE_SIZE = 50;

import vertexShaderSource from "./shaders/vertex.js";
import fragmentShaderSource from "./shaders/fragment.js";

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

gl.useProgram(program);

const squarePositions = new Uint32Array([
  100, 100,
  250, 100,
  400, 200,
  400, 400,
]);
makeBuffer(squarePositions);
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribIPointer(
  positionLocation,
  2,
  gl.UNSIGNED_INT,
  false,
  0,
  0,
);
gl.vertexAttribDivisor(positionLocation, 1);

// Triangle Fan
const segmentInstanceGeometry =  new Int32Array([
  -1, -1,
  1, -1,
  1, 1,
  -1, 1,
]);

makeBuffer(segmentInstanceGeometry);
const vertexOffsetLocation = gl.getAttribLocation(program, "vertexOffset");
gl.enableVertexAttribArray(vertexOffsetLocation);
gl.vertexAttribIPointer(
  vertexOffsetLocation,
  2,
  gl.INT,
  false,
  0,
  0,
);
gl.vertexAttribDivisor(vertexOffsetLocation, 0);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const sizeLocation = gl.getUniformLocation(program, "size");

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.uniform2f(resolutionLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);
gl.uniform1f(sizeLocation, SQUARE_SIZE);

const vertexPerInstance = segmentInstanceGeometry.length / 2;
const instanceCount = squarePositions.length / 2;

gl.drawArraysInstanced(
  gl.TRIANGLE_FAN,
  0,
  vertexPerInstance,
  instanceCount,
);
