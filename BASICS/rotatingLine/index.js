import { gl as GL, makeProgram, makeBuffer } from "webglutils";
/**
 * @type { WebGL2RenderingContext }
 */
const gl = GL;

import { rotation, translation, multiply } from "../../../utils/math/mat3.js";

const LINE_LENGTH = 200;

const vertexShaderSource = `
in vec2 position;

uniform mat3 matrix;

void main() {
  vec2 worldPosition = (matrix * vec3(position, 1)).xy;
  gl_Position = vec4(worldPosition, 0, 1);
}
`;

const fragmentShaderSource = `
precision highp float;
 
out vec4 outColor; 
 
void main() {
   outColor = vec4(0, 0, 0, 1);
}
`;

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const positionLocation = gl.getAttribLocation(program, "position");

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const matrixLocation = gl.getUniformLocation(program, "matrix");

makeBuffer(new Float32Array([0, 1, 0, -1]));
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

let angle = 90;

function draw() {
  angle += 0.1;

  gl.useProgram(program);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  const rotationMatrix = rotation((angle / 180) * Math.PI);

  gl.uniformMatrix3fv(
    matrixLocation,
    false,
    rotationMatrix
  );

  gl.clearColor(0, 0, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.LINES, 0, 2);

  requestAnimationFrame(draw);
}

draw();
