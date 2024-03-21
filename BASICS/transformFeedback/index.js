import { gl, makeProgram, makeBuffer } from '../../webglutils.js';

const SEPARATE_ATTRIBS = false;

const vertexShaderSource = `
in float aInput;

out float vOutput1;
out float vOutput2;

void main() {
  vOutput1 = aInput;
  vOutput2 = aInput * 10.;
}
`;

const fragmentShaderSource = `
void main() {
  discard;
}
`;

const inputData = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const inputBuffer = makeBuffer(inputData);
const count = inputData.length;

const program = makeProgram(vertexShaderSource, fragmentShaderSource, ["vOutput1", "vOutput2"], SEPARATE_ATTRIBS ? gl.SEPARATE_ATTRIBS : gl.INTERLEAVED_ATTRIBS);

const aInput = gl.getAttribLocation(program, "aInput");
gl.enableVertexAttribArray(aInput);
gl.bindBuffer(gl.ARRAY_BUFFER, inputBuffer);
gl.vertexAttribPointer(aInput, 1, gl.FLOAT, false, 0, 0);

const tf = gl.createTransformFeedback();
gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

const tfBuffer1 = gl.createBuffer();
gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, tfBuffer1);
gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, count * Float32Array.BYTES_PER_ELEMENT * (SEPARATE_ATTRIBS ? 1 : 2), gl.STREAM_COPY);
gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, tfBuffer1);

let tfBuffer2;
if (SEPARATE_ATTRIBS) {
  tfBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, tfBuffer2);
  gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, count * Float32Array.BYTES_PER_ELEMENT, gl.STREAM_COPY);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, tfBuffer2);
}

// Rendering
gl.enable(gl.RASTERIZER_DISCARD);
gl.useProgram(program);
gl.beginTransformFeedback(gl.POINTS);
gl.drawArrays(gl.POINTS, 0, count);
gl.endTransformFeedback();
gl.disable(gl.RASTERIZER_DISCARD);

/*** LOG ***/
const feedbackValues = new Float32Array(count * (SEPARATE_ATTRIBS ? 1 : 2));
gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, tfBuffer1);
gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedbackValues);
console.log(feedbackValues);

if (SEPARATE_ATTRIBS) {
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, tfBuffer2);
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, feedbackValues);
  console.log(feedbackValues);
}