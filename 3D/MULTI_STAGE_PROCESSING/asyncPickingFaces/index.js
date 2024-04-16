
import { gl as importedGL } from "webglutils";
import makeGeometryProgram from "./programs/geometryProgram.js";
import makeQuadProgram from "./programs/quadProgram.js";

import makeAsyncPickingQueue from "./asyncPickingQueue.js";

/** @type { WebGL2RenderingContext } */
const gl = importedGL;

const drawGeometry = makeGeometryProgram();
const drawQuad = makeQuadProgram();

const { drawingBufferWidth, drawingBufferHeight } = gl;

const colorTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, colorTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, drawingBufferWidth, drawingBufferHeight);

const vertexIdTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, vertexIdTexture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8UI, drawingBufferWidth, drawingBufferHeight);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // This is mandatory for integer textures

const renderBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, drawingBufferWidth, drawingBufferHeight);

const framebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, vertexIdTexture, 0);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

console.log("is FRAMEBUFFER complete ? : ", gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);

const queue = makeAsyncPickingQueue(gl);

let hoveredFaceId = null;

function draw() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

  drawGeometry(hoveredFaceId);

  queue.flush().then(faceId => {
    if (faceId === undefined) {
      return;
    } else if (faceId === 0) {
      hoveredFaceId = null;
    } else {
      hoveredFaceId = faceId;
    }
  });

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  drawQuad(colorTexture);

  requestAnimationFrame(draw);
}

draw();
