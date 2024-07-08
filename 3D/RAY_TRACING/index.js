import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";

import fragmentShaderSource from "./shaders/fragment/index.js";

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
const frameLocation = gl.getUniformLocation(program, "frame");
const texLocation = gl.getUniformLocation(program, "tex");

const { width, height } = gl.canvas;
const resolution = [width, height];
let frame = 0;

const texture = gl.createTexture();
const activeTexture = gl.TEXTURE0 + 4;
gl.activeTexture(activeTexture);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);

const frameBuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

gl.useProgram(program);

function draw() {
  gl.viewport(0, 0, width, height);

  gl.uniform2fv(resolutionLocation, resolution);
  gl.uniform1f(frameLocation, frame++);
  gl.uniform1i(texLocation, activeTexture - gl.TEXTURE0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
  gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  requestAnimationFrame(draw);
}

draw();
