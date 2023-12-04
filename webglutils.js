const canvas = document.getElementById("canvas");
/** @type { WebGL2RenderingContext } */
const gl = canvas.getContext("webgl2", { antialias: false });

/**
 * @param { string } vertexShaderSource
 * @param { string } fragmentShaderSource
 *
 * @returns { WebGLProgram }
 */
function makeProgram(vertexShaderSource, fragmentShaderSource, transformFeedbackVaryings = []) {
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
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

/**
 *
 * @param { WebGLProgram } program
 */
function progUtil(program) {
  const activeAttributes = gl.getProgramParameter(
    program,
    gl.ACTIVE_ATTRIBUTES
  );
  for (let i = 0; i < activeAttributes; ++i) {
    const { name, type, size } = gl.getActiveAttrib(program, i);
  }
  const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
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
function createBuffer(data, usage = gl.STATIC_DRAW, target = gl.ARRAY_BUFFER) {
  const buffer = gl.createBuffer();

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);

  return buffer;
}

const WebGLUtils = {
  makeProgram,
  createBuffer,
  gl,
};

export default WebGLUtils;
