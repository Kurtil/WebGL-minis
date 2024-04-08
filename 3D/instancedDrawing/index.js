import { makeCube } from "../../utils/geometryBuilder.js";
import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";
import { create as createMat4, perspectiveZO, lookAt, rotateY, rotateX } from "../../utils/math/mat4.js";

const INSTANCE_COUNT = 100;

const { positions, colors } = makeCube();

const vertexShaderSource = `
in vec4 position;
in vec4 color;
in float xOffset;
in float yOffset;
in float tint;

out vec4 v_color;
out float v_tint;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main() {
  v_color = color;
  v_tint = tint;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
  gl_Position.x += xOffset;
  gl_Position.y += yOffset;
}
`;

const fragmentShaderSource = `
precision highp float;

in vec4 v_color;
in float v_tint;
 
out vec4 color; 
 
void main() {
  color = v_color;
  color.r += v_tint;
}
`;


const program = makeProgram(vertexShaderSource, fragmentShaderSource);

const positionLocation = gl.getAttribLocation(program, "position");
const colorLocation = gl.getAttribLocation(program, "color");
const xOffsetLocation = gl.getAttribLocation(program, "xOffset");
const yOffsetLocation = gl.getAttribLocation(program, "yOffset");
const tintLocation = gl.getAttribLocation(program, "tint");

const projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
const viewMatrixLocation = gl.getUniformLocation(program, "viewMatrix");
const modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");

makeBuffer(positions); //the method return is not needed as the buffer is already binded

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

makeBuffer(colors);

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0); // normalized: true converts from 0-255 to 0.0-1.0

makeBuffer(new Float32Array(Array.from({ length: INSTANCE_COUNT }, () => Math.random() * 3000 - 1500)));

gl.enableVertexAttribArray(xOffsetLocation);
gl.vertexAttribPointer(xOffsetLocation, 1, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(xOffsetLocation, 1);

makeBuffer(new Float32Array(Array.from({ length: INSTANCE_COUNT }, () => Math.random() * 3000 - 1500)));

gl.enableVertexAttribArray(yOffsetLocation);
gl.vertexAttribPointer(yOffsetLocation, 1, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(yOffsetLocation, 1);

const tintData = new Float32Array([-0.5, 0, 0.5, 1]);
makeBuffer(tintData);

gl.enableVertexAttribArray(tintLocation);
gl.vertexAttribPointer(tintLocation, 1, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(tintLocation, INSTANCE_COUNT / tintData.length);
// vertex attrib divisor is the number of instances that will be drawn before the attribute advances to the next instance

// PROJECTION
const fovy = 90 / 180 * Math.PI;

const { width, height } = gl.canvas;
const aspec = width / height;

const projectionMatrix = perspectiveZO(createMat4(), fovy, aspec, 1, 2000);

const viewMatrix = lookAt(createMat4(), [0, 0, 1500], [0, 0, 0], [0, 1, 0]);

const modelMatrix = createMat4();

gl.useProgram(program);

gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

function draw() {
  gl.clearColor(0.5, 0.5, 0.5, 1);

  // ROTATE MODEL MATRIX
  rotateY(modelMatrix, modelMatrix, 0.01);
  rotateX(modelMatrix, modelMatrix, 0.02);
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, positions.length / 3, INSTANCE_COUNT);

  requestAnimationFrame(draw);
}

draw();
