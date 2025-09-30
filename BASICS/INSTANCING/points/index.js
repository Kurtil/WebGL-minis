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

gl.drawArraysInstanced(
  gl.POINTS,
  0,
  4,
  1,
);
