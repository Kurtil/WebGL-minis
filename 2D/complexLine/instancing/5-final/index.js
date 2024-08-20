import { gl as GL, makeProgram, makeBuffer } from "webglutils";
/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

const LINE_WIDTH = 20;

import vertexShaderSource from "./shaders/line/vertex.js";
import fragmentShaderSource from "./shaders/line/fragment.js";

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

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
  400, 300,
  100, 400,
]);

const pathBuffer = makeBuffer(path);  
const pointALocation = gl.getAttribLocation(program, "pA");
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

const pointBLocation = gl.getAttribLocation(program, "pB");
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

const pointCLocation = gl.getAttribLocation(program, "pC");
gl.enableVertexAttribArray(pointCLocation);
gl.vertexAttribPointer(
  pointCLocation,
  2,
  gl.FLOAT,
  false,
  0,
  Float32Array.BYTES_PER_ELEMENT * 4,
);
gl.vertexAttribDivisor(pointCLocation, 1);

const pointLocation = gl.getAttribLocation(program, "pD");
gl.enableVertexAttribArray(pointLocation);
gl.vertexAttribPointer(
  pointLocation,
  2,
  gl.FLOAT,
  false,
  0,
  Float32Array.BYTES_PER_ELEMENT * 6,
);
gl.vertexAttribDivisor(pointLocation, 1);

gl.useProgram(program);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const widthLocation = gl.getUniformLocation(program, "width");
gl.uniform1f(widthLocation, LINE_WIDTH);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

const lineSegmentCount = path.length / 2 - 3;
const instanceGeometryCount = segmentInstanceGeometry.length / 2;

gl.enable(gl.BLEND);

gl.drawArraysInstanced(
  gl.TRIANGLES,
  0,
  instanceGeometryCount,
  lineSegmentCount
);

// MITER JOIN

import joinVertexShaderSource from "./shaders/miter/vertex.js";
import joinFragmentShaderSource from "./shaders/miter/fragment.js";

const joinProgram = makeProgram(
  joinVertexShaderSource,
  joinFragmentShaderSource
);

/** pseudo geometry used as coefficient use to index the miter basis vectors
 *  primitive = triangle fan
 * 
 *    p2 – p1 – p0
 *     \   |   /
 *      \  |  /
 *       \ | /
 *        \|/
 *       pointB
 */
const miterJoinInstanceGeometry = new Float32Array([
  0, 0, 0,
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
]);

makeBuffer(miterJoinInstanceGeometry);

const joinPositionLocation = gl.getAttribLocation(joinProgram, "position");
gl.enableVertexAttribArray(joinPositionLocation);
gl.vertexAttribPointer(
  joinPositionLocation,
  3,
  gl.FLOAT,
  false,
  0,
  0,
);
gl.vertexAttribDivisor(joinPositionLocation, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, pathBuffer);

const joinPointALocation = gl.getAttribLocation(joinProgram, "pointA");
gl.enableVertexAttribArray(joinPointALocation);
gl.vertexAttribPointer(
  joinPointALocation,
  2,
  gl.FLOAT,
  false,
  0,
  Float32Array.BYTES_PER_ELEMENT * 0,
);
gl.vertexAttribDivisor(joinPointALocation, 1);

const joinPointBLocation = gl.getAttribLocation(joinProgram, "pointB");
gl.enableVertexAttribArray(joinPointBLocation);
gl.vertexAttribPointer(
  joinPointBLocation,
  2,
  gl.FLOAT,
  false,
  0,
  Float32Array.BYTES_PER_ELEMENT * 2,
);
gl.vertexAttribDivisor(joinPointBLocation, 1);

const joinPointCLocation = gl.getAttribLocation(joinProgram, "pointC");
gl.enableVertexAttribArray(joinPointCLocation);
gl.vertexAttribPointer(
  joinPointCLocation,
  2,
  gl.FLOAT,
  false,
  0,
  Float32Array.BYTES_PER_ELEMENT * 4,
);
gl.vertexAttribDivisor(joinPointCLocation, 1);

gl.useProgram(joinProgram);

const joinResolutionLocation = gl.getUniformLocation(joinProgram, "resolution");
gl.uniform2f(joinResolutionLocation, gl.canvas.width, gl.canvas.height);

const joinWidthLocation = gl.getUniformLocation(joinProgram, "width");
gl.uniform1f(joinWidthLocation, LINE_WIDTH);

// gl.drawArraysInstanced(
//   gl.TRIANGLE_FAN,
//   0,
//   miterJoinInstanceGeometry.length / 3,
//   path.length / 2 - 2
// );




