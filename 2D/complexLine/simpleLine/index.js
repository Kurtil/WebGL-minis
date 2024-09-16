import { gl as GL, makeProgram, makeBuffer } from "webglutils";
import vertexShaderSource from "./shaders/vertex.js";
import fragmentShaderSource from "./shaders/fragment.js";

/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

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

// a 1 indexed array
const segmentIndexes = new Uint32Array([
  1, 2, 3, 0,
  4, 5, 6, 7, 0,
  8, 9, 10, 0,
  // 11, 12, 0
]);

const pointsTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, pointsTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RG32F, points.length / 2, 1);
gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, points.length / 2, 1, gl.RG, gl.FLOAT, points);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

makeBuffer(segmentIndexes);
const pointAAttributeLocation = gl.getAttribLocation(program, "pointA");
gl.enableVertexAttribArray(pointAAttributeLocation);
gl.vertexAttribIPointer(pointAAttributeLocation, 1, gl.UNSIGNED_INT, false, 0, 0);
gl.vertexAttribDivisor(pointAAttributeLocation, 0);

const pointBAttributeLocation = gl.getAttribLocation(program, "pointB");
gl.enableVertexAttribArray(pointBAttributeLocation);
gl.vertexAttribIPointer(pointBAttributeLocation, 1, gl.UNSIGNED_INT, false, 0, Uint32Array.BYTES_PER_ELEMENT);
gl.vertexAttribDivisor(pointBAttributeLocation, 0);

const isPointB = new Uint32Array([0, 1]);
makeBuffer(isPointB);
const isPointBAttributeLocation = gl.getAttribLocation(program, "isPointB");
gl.enableVertexAttribArray(isPointBAttributeLocation);
gl.vertexAttribIPointer(isPointBAttributeLocation, 1, gl.UNSIGNED_INT, false, 0, 0);
gl.vertexAttribDivisor(isPointBAttributeLocation, 1);

gl.getUniformLocation(program, "points");
gl.getUniformLocation(program, "resolution");

gl.useProgram(program);

gl.uniform1i(gl.getUniformLocation(program, "points"), 0);
gl.uniform2f(gl.getUniformLocation(program, "resolution"), gl.canvas.clientWidth, gl.canvas.clientHeight);

gl.drawArraysInstanced(gl.LINE_STRIP, 0, segmentIndexes.length, isPointB.length);
