import { makeCube } from "../../utils/geometryBuilder.js";
import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";
import { create as createMat4, perspectiveZO, lookAt, rotateY, rotateX } from "../../utils/math/mat4.js";

const { positions, colors } = makeCube();

const vertexShaderSource = `
in vec4 position;
in vec4 color;

out vec4 v_color;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main() {
  v_color = color;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
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
const modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");

makeBuffer(positions); //the method return is not needed as the buffer is already binded

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

makeBuffer(colors);

gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0); // normalized: true converts from 0-255 to 0.0-1.0

// PROJECTION
const fovy = 70 / 180 * Math.PI;

const { width, height } = gl.canvas;
const aspec = width / height;

const projectionMatrix = perspectiveZO(createMat4(), fovy, aspec, 1, 2000);

const viewMatrix = lookAt(createMat4(), [0, 0, 500], [0, 0, 0], [0, 1, 0]);

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

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

  requestAnimationFrame(draw);
}

draw();
