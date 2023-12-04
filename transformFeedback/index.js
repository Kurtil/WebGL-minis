import WebGLUtils from '../webglutils.js';

const { gl, makeProgram } = WebGLUtils;

const vertexShaderSource = `\
#version 300 es

uniform int uCount;
flat out int vIndex;

void main() {
  vIndex = gl_VertexID;
}
`;

const fragmentShaderSource = `\
#version 300 es

void main() {
  discard;
}
`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource, ["vIndex"]);
const uCountLocation = gl.getUniformLocation(program, "uCount");
const count = 10;

const tf = gl.createTransformFeedback();
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

const tfBuffer = gl.createBuffer();
gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, tfBuffer);
gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, count * 4, gl.STREAM_COPY);
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, tfBuffer);

// Rendering
gl.enable(gl.RASTERIZER_DISCARD);
gl.useProgram(program);
gl.uniform1i(uCountLocation, count);
gl.beginTransformFeedback(gl.POINTS);
gl.drawArrays(gl.POINTS, 0, count);
gl.endTransformFeedback();
gl.disable(gl.RASTERIZER_DISCARD);

const feedbackValues = new Int32Array(count);
gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedbackValues);

console.log(feedbackValues); // Should print the numbers 0 through 9