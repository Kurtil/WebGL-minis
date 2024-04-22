// Equivalent to xeokit data textures
// Follow along from https://webgl2fundamentals.org/webgl/lessons/webgl-pulling-vertices.html

import { makeCube } from "../../utils/geometryBuilder.js";
import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";
import { create as createMat4, perspectiveZO, lookAt, rotateY, rotateX } from "../../utils/math/mat4.js";
import makeCheckerTexture from "./checkerTexture.js";

const { positions } = makeCube();

const faceUVs = [
  0, 0,
  1, 0,
  1, 1,
  0, 0,
  1, 1,
  0, 1,
];

const faceCount = 6;

const uvs = new Float32Array(
  Array(faceCount).fill(faceUVs).flat()
);

const vertexShaderSource = `
in vec4 position;
in vec2 uv;

out vec2 v_uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
}
`;

const fragmentShaderSource = `
precision highp float;

in vec2 v_uv;
uniform sampler2D u_texture;
 
out vec4 color; 
 
void main() {
  float luminance = texture(u_texture, v_uv).r;
  color = vec4(luminance, luminance, luminance, 1.0);
}
`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

const positionLocation = gl.getAttribLocation(program, "position");
const uvLocation = gl.getAttribLocation(program, "uv");

const textureLocation = gl.getUniformLocation(program, "u_texture");

const projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
const viewMatrixLocation = gl.getUniformLocation(program, "viewMatrix");
const modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");

makeBuffer(positions);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

makeBuffer(uvs);

gl.enableVertexAttribArray(uvLocation);
gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

// Texture
const checkerTexture = makeCheckerTexture(gl);

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

const textureUnit = 3;
gl.activeTexture(gl.TEXTURE0 + textureUnit);
gl.bindTexture(gl.TEXTURE_2D, checkerTexture);
gl.uniform1i(textureLocation, textureUnit);

gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

function draw() {
  gl.clearColor(0.1, 0.1, 0.1, 1);

  // ROTATE MODEL MATRIX
  rotateY(modelMatrix, modelMatrix, 0.01);
  rotateX(modelMatrix, modelMatrix, 0.02);
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

  requestAnimationFrame(draw);
}

draw();
