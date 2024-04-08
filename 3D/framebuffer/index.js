
import { gl as importedGL } from "webglutils";
import makeGeometryProgram from "./programs/geometryProgram.js";
import makeQuadProgram from "./programs/quadProgram.js";

/** @type { WebGL2RenderingContext } */
const gl = importedGL;

const drawGeometry = makeGeometryProgram();
const drawQuad = makeQuadProgram();

const { drawingBufferWidth, drawingBufferHeight } = gl;

const colorTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, colorTexture);
// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, drawingBufferWidth, drawingBufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, drawingBufferWidth, drawingBufferHeight);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

const renderBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, drawingBufferWidth, drawingBufferHeight);

const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

console.log("is FRAMEBUFFER complete ? : ", gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);

function draw() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  drawGeometry();

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  drawQuad(colorTexture);

  requestAnimationFrame(draw);
}

draw();
