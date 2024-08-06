import { gl as GL, makeProgram, makeBuffer } from "webglutils";
/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

const LINE_WIDTH = 10;

import vertexShaderSource from "./shaders/vertex.js";
import fragmentShaderSource from "./shaders/fragment.js";

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

gl.useProgram(program);

/**
 *            _________
 *  (0, 0.5) |        /| (1, 0.5) 
 *           |      /  |
 *   (0, 0)  +    /    |
 *           |  /      |
 * (0, -0.5) |/________| (1, -0.5) 
 */
const segmentInstanceGeometry =  new Float32Array([
  0, -0.5,
  1, -0.5,
  1,  0.5,
  0, -0.5,
  1,  0.5,
  0,  0.5
]);

makeBuffer(segmentInstanceGeometry);
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(
  positionLocation,
  2,
  gl.FLOAT,
  false,
  0,
  0,
);
gl.vertexAttribDivisor(positionLocation, 0);

const path = new Float32Array([
  100, 100,
  200, 200,
  300, 100,
  400, 200,
  300, 300,
  400, 400
]);

makeBuffer(path);  
const pointALocation = gl.getAttribLocation(program, "pointA");
gl.enableVertexAttribArray(pointALocation);
gl.vertexAttribPointer(
  pointALocation,
  2,
  gl.FLOAT,
  false,
  0,
  0,
);
gl.vertexAttribDivisor(pointALocation, 1);

const pointBLocation = gl.getAttribLocation(program, "pointB");
gl.enableVertexAttribArray(pointBLocation);
gl.vertexAttribPointer(
  pointBLocation,
  2,
  gl.FLOAT,
  false,
  0,
  Float32Array.BYTES_PER_ELEMENT * 2,
);
gl.vertexAttribDivisor(pointBLocation, 1);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const widthLocation = gl.getUniformLocation(program, "width");
gl.uniform1f(widthLocation, LINE_WIDTH);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

const lineSegmentCount = path.length / 2 - 1;
const instanceGeometryCount = segmentInstanceGeometry.length / 2;

gl.drawArraysInstanced(
  gl.TRIANGLES,
  0,
  instanceGeometryCount,
  lineSegmentCount
);
