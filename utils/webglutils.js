const canvas = document.getElementById("canvas");
/** @type { WebGL2RenderingContext } */
const gl = canvas.getContext("webgl2", { antialias: false, stencil: true });

gl.canvas.width = canvas.clientWidth * window.devicePixelRatio;
gl.canvas.height = canvas.clientHeight * window.devicePixelRatio;

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

/**
 * @param { string } vertexShaderSource
 * @param { string } fragmentShaderSource
 *
 * @returns { WebGLProgram }
 */
function makeProgram(vertexShaderSource, fragmentShaderSource, transformFeedbackVaryings = [], transformFeedbackVaryingsBufferMode = gl.SEPARATE_ATTRIBS) {
  if (typeof vertexShaderSource !== "string" || typeof fragmentShaderSource !== "string") {
    throw new Error("Both vertexShaderSource and fragmentShaderSource must be strings");
  }

  if (!vertexShaderSource.startsWith("#version 300 es")) {
    vertexShaderSource = `#version 300 es\n\n${vertexShaderSource}`;
  }

  if (!fragmentShaderSource.startsWith("#version 300 es")) {
    fragmentShaderSource = `#version 300 es\n\n${fragmentShaderSource}`;
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader));
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader));
  }

  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (transformFeedbackVaryings.length) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, transformFeedbackVaryingsBufferMode);
  }

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

/**
 * TypedArray
 * @typedef {Int8Array|Int16Array|Int32Array|BigInt64Array|Uint8Array|Uint16Array|Uint32Array|BigUint64Array|Float32Array|Float64Array} TypedArray
 *
 * @typedef { } WebglbufferUsage
 */

/**
 * Returns a binded buffer.
 *
 * @param { TypedArray } data
 * @param { number } [usage]
 * @param { number } [target]
 *
 * @returns { WebGLBuffer }
 */
function makeBuffer(data, usage = gl.STATIC_DRAW, target = gl.ARRAY_BUFFER) {
  const buffer = gl.createBuffer();

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);

  return buffer;
}

export {
  makeProgram,
  makeBuffer,
  gl,
};
