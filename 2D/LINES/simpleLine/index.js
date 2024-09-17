import getDrawPoints from "../../../utils/points/drawPoints.js";
import bind from "./rangeInput.js";

import { gl as GL, makeProgram, makeBuffer } from "webglutils";
/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

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
 * 
 * Drawn using TRIANGLE_FAN primitive
 */
const segmentInstanceGeometry =  new Float32Array([
  0, -0.5,
  1, -0.5,
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

const points = new Float32Array([
  // line 1
  100, 100,
  200, 200,
  300, 100,

  // line 2
  400, 200,
  300, 300,
  400, 300,
  100, 400,
  // line 3 - TODO close stroke
  400, 450,
  450, 450,
  450, 350,
  // line 4
  450, 300,
  450, 200
]);

const pointsTexture = gl.createTexture();
const pointsTextureNumber = 0;
gl.activeTexture(gl.TEXTURE0 + pointsTextureNumber);
gl.bindTexture(gl.TEXTURE_2D, pointsTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32F, points.length / 2, 1);
gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, points.length / 2, 1, gl.RG, gl.FLOAT, points);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

// a 1 indexed array
const segmentIndexes = new Uint32Array([
  1, 2, 3, 0,
  4, 5, 6, 7, 0,
  8, 9, 10, 0,
  11, 12,
]);
makeBuffer(segmentIndexes);
const pointAIndexAttributeLocation = gl.getAttribLocation(program, "pointAIndex");
gl.enableVertexAttribArray(pointAIndexAttributeLocation);
gl.vertexAttribIPointer(pointAIndexAttributeLocation, 1, gl.UNSIGNED_INT, 0, 0);
gl.vertexAttribDivisor(pointAIndexAttributeLocation, 1);

const pointBIndexAttributeLocation = gl.getAttribLocation(program, "pointBIndex");
gl.enableVertexAttribArray(pointBIndexAttributeLocation);
gl.vertexAttribIPointer(pointBIndexAttributeLocation, 1, gl.UNSIGNED_INT, 0, Uint32Array.BYTES_PER_ELEMENT);
gl.vertexAttribDivisor(pointBIndexAttributeLocation, 1);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const widthLocation = gl.getUniformLocation(program, "width");
const pointsLocation = gl.getUniformLocation(program, "points");

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

const lineSegmentCount = segmentIndexes.length - 1;
const instanceGeometryCount = segmentInstanceGeometry.length / 2;

const drawPoints = getDrawPoints(points);

function draw(lineWidth = 1) {
  gl.useProgram(program);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform1i(pointsLocation, pointsTextureNumber);
  gl.uniform2f(resolutionLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.uniform1f(widthLocation, lineWidth);
  
  gl.drawArraysInstanced(
    gl.TRIANGLE_FAN,
    0,
    instanceGeometryCount,
    lineSegmentCount,
  );
  
  // POINTS for debugging
  drawPoints();
}

draw();

bind(draw);