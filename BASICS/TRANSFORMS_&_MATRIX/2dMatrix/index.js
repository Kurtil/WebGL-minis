import { gl, makeProgram } from "webglutils";

import { multiply, rotation, scale, translation } from "../../../utils/math/mat3.js";

/**
 * Set data to the binded array buffer
 *
 * @param { number } x
 * @param { number } y
 * @param { number } width
 * @param { number } height
 */
function setRectangle(x = 0, y = 0, width = 100, height = 50) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y2, x2, y1, x1, y1, x1, y2, x2, y2]),
    gl.STATIC_DRAW
  );
}

const vertexShaderSource = `
in vec2 position;

uniform vec2 resolution;
uniform mat3 matrix;

void main() {

  // css to => 0 - 1
  vec2 zeroToOne = (matrix * vec3(position, 1)).xy / resolution;
  // 0 - 1 => 0 - 2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // 0 - 2 => -1 - 1
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);
}
`;

const fragmentShaderSource = `
precision highp float;
 
out vec4 outColor; 
 
void main() {
   outColor = vec4(0, 1, 1, 1);
}
`;

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const positionLocation = gl.getAttribLocation(program, "position");

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const matrixLocation = gl.getUniformLocation(program, "matrix");

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
setRectangle();

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

let dx = 0;
let dy = 0;
let angle = 90;
let sx = 1;
let sy = 1;

function draw() {
  gl.useProgram(program);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  const translateMatrix = translation(dx, dy);
  const rotationMatrix = rotation((angle / 180) * Math.PI);
  const scaleMatrix = scale(sx, sy);

  gl.uniformMatrix3fv(
    matrixLocation,
    false,
    multiply(
      multiply(multiply(translation(-50, -25), scaleMatrix), rotationMatrix),
      translateMatrix
      )
    );

  gl.clearColor(0.5, 0.5, 0.5, 1);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

draw();

const rangeX = document.getElementById("x");
const rangeY = document.getElementById("y");
const degree = document.getElementById("rotation");
const scalerX = document.getElementById("scaleX");
const scalerY = document.getElementById("scaleY");

rangeX.addEventListener("input", event => {
  dx = +event.target.value;
  draw();
});
rangeY.addEventListener("input", event => {
  dy = +event.target.value;
  draw();
});
degree.addEventListener("input", event => {
  angle = +event.target.value;
  draw();
});
scalerX.addEventListener("input", event => {
  sx = +event.target.value;
  draw();
});
scalerY.addEventListener("input", event => {
  sy = +event.target.value;
  draw();
});
