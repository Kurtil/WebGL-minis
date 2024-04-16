import { gl as GL, makeBuffer, makeProgram } from "webglutils";
import { makeCube } from "geometryBuilder";
import { create as createMat4, perspectiveZO, lookAt, rotateY, rotateX } from "mat4";

/** @type { WebGL2RenderingContext } */
const gl = GL;

export default function makeGeometryProgram() {
  const { positions, colors } = makeCube();

  const vertexShaderSource = `
  in vec4 position;
  in vec4 color;
  
  out vec4 v_color;
  flat out int v_faceId;
  
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;

  uniform int hoveredFaceId;
  
  void main() {
    // test if faceId is from the current face
    vec4 newColor = color;
    if (hoveredFaceId != 0 && (hoveredFaceId - 1) == gl_VertexID / 6) {
      newColor = vec4(1, 0, 0, 1);
    }
    v_color = newColor;
    v_faceId = (gl_VertexID / 6) + 1;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;
  }
  `;

  const fragmentShaderSource = `
  precision highp float;
  precision highp int;
  
  in vec4 v_color;
  flat in int v_faceId;
   
  layout(location = 0) out vec4 color; 
  layout(location = 1) out uint vertexId;
   
  void main() {
    color = v_color;
    vertexId = uint(v_faceId);
  }
  `;

  const program = makeProgram(vertexShaderSource, fragmentShaderSource);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionLocation = gl.getAttribLocation(program, "position");
  const colorLocation = gl.getAttribLocation(program, "color");

  const projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
  const viewMatrixLocation = gl.getUniformLocation(program, "viewMatrix");
  const modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");

  const hoveredFaceIdLocation = gl.getUniformLocation(program, "hoveredFaceId");

  makeBuffer(positions);

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

  const viewMatrix = lookAt(createMat4(), [0, 200, 500], [0, 0, 0], [0, 1, 0]);

  const modelMatrix = createMat4();

  gl.useProgram(program);

  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
  gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

  return (hoveredFaceId = 0) => {
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // ROTATE MODEL MATRIX
    rotateY(modelMatrix, modelMatrix, 0.01);
    rotateX(modelMatrix, modelMatrix, 0.02);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    gl.uniform1i(hoveredFaceIdLocation, hoveredFaceId);

    gl.clearBufferfv(gl.COLOR, 0, new Float32Array([0, 0, 0, 0]));
    gl.clearBufferuiv(gl.COLOR, 1, new Uint32Array([0, 0, 0, 0]));
    gl.clearBufferfv(gl.DEPTH, 0, [1]);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
  }
}