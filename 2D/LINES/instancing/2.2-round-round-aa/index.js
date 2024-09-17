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
  150, 100,
  200, 200,
  300, 100,
  400, 200,
  100, 250,
  450, 420
]);

const pathBuffer = makeBuffer(path);  
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

gl.useProgram(program);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

const widthLocation = gl.getUniformLocation(program, "width");
gl.uniform1f(widthLocation, LINE_WIDTH);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

const lineSegmentCount = path.length / 2 - 1;
const instanceGeometryCount = segmentInstanceGeometry.length / 2;

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

gl.drawArraysInstanced(
  gl.TRIANGLES,
  0,
  instanceGeometryCount,
  lineSegmentCount
);

// ROUND JOIN AND CAPS

// import joinVertexShaderSource from "./shaders/round/vertex.js";
// import joinFragmentShaderSource from "./shaders/round/fragment.js";

// const joinProgram = makeProgram(
//   joinVertexShaderSource,
//   joinFragmentShaderSource
// );

// // a square that fits inside a circle drawn using triangle fan
// // and use signed distance function to draw the circle
// const roundJoinInstanceGeometry = new Float32Array([
//   0, 0,
//   1, 0,
//   1, 1,
//   0, 1
// ]);

// makeBuffer(roundJoinInstanceGeometry);

// const joinPositionLocation = gl.getAttribLocation(joinProgram, "position");
// gl.enableVertexAttribArray(joinPositionLocation);
// gl.vertexAttribPointer(
//   joinPositionLocation,
//   2,
//   gl.FLOAT,
//   false,
//   0,
//   0,
// );
// gl.vertexAttribDivisor(joinPositionLocation, 0);

// const joinPointLocation = gl.getAttribLocation(joinProgram, "point");
// gl.enableVertexAttribArray(joinPointLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, pathBuffer);
// gl.vertexAttribPointer(
//   joinPointLocation,
//   2,
//   gl.FLOAT,
//   false,
//   0,
//   0,
// );
// gl.vertexAttribDivisor(joinPointLocation, 1);

// gl.useProgram(joinProgram);

// const joinResolutionLocation = gl.getUniformLocation(joinProgram, "resolution");
// gl.uniform2f(joinResolutionLocation, gl.canvas.width, gl.canvas.height);

// const joinWidthLocation = gl.getUniformLocation(joinProgram, "width");
// gl.uniform1f(joinWidthLocation, LINE_WIDTH);

// // do not override segment by join transparency
// gl.enable(gl.BLEND);
// gl.blendEquation(gl.MAX);

// gl.drawArraysInstanced(
//   gl.TRIANGLE_FAN,
//   0,
//   roundJoinInstanceGeometry.length / 2,
//   path.length / 2
// );




