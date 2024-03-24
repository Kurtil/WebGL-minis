import { makeFLetterGeometry } from "../geometryBuilder.js";
import { gl, makeBuffer, makeProgram } from "../webglutils.js";
import { create as createMat4, perspectiveZO, lookAt } from "../math/mat4.js";

const { positions, colors } = makeFLetterGeometry();

const vertexShaderSource = `
in vec4 position;
in vec4 color;

out vec4 v_color;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main() {
  v_color = color;
  gl_Position = projectionMatrix * viewMatrix * position;
}
`;

const fragmentShaderSource = `
precision highp float;

in vec4 v_color;
 
out vec4 color; 
 
void main() {
  color = v_color;
}
`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

const positionLocation = gl.getAttribLocation(program, "position");
const colorLocation = gl.getAttribLocation(program, "color");

const projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
const viewMatrixLocation = gl.getUniformLocation(program, "viewMatrix");

makeBuffer(positions);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

makeBuffer(colors);

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0); // normalized: true converts from 0-255 to 0.0-1.0

// PROJECTION
const fovy = 90 / 180 * Math.PI;

const { width, height } = gl.canvas;
const aspec = width / height;


const projectionMatrix = perspectiveZO(createMat4(), fovy, aspec, 1, 2000);

const viewMatrix = lookAt(createMat4(), [0, 300, 300], [0, 0, 0], [0, 1, 0]);

gl.useProgram(program);

gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

const fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

console.log(gl.drawingBufferColorSpace, gl.drawingBufferWidth);

const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

gl.texImage2D(
    gl.TEXTURE_2D,
    0,                // mip level
    gl.RGBA,          // internal format
    gl.drawingBufferWidth / 2,   // width
    gl.drawingBufferHeight / 2,  // height
    0,                // border
    gl.RGBA,          // format
    gl.UNSIGNED_BYTE, // type
    null,             // data
);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0.5, 0.5, 0.5, 1);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
