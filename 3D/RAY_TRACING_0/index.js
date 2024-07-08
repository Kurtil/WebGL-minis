import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";

import fragmentShaderSource from "./shaders/fragment/fragment.js";

import vertexShaderSource from "./shaders/vertex/vertex.js";

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

const quad = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1,
]);

const positionLocation = gl.getAttribLocation(program, "position");
makeBuffer(quad);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const timeLocation = gl.getUniformLocation(program, "time");
const { width, height } = gl.canvas;
const resolution = [width, height];
const startTime = Date.now();

gl.useProgram(program);

function draw() {
  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.uniform2fv(resolutionLocation, resolution);
  gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(draw);
}

draw();
