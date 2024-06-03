import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";

const vertexShaderSource = `
in vec2 position;

void main() {
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShaderSource = `
precision highp float;
 
out vec4 color;

uniform vec2 resolution;
 
void main() {
  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;

  color = vec4(uv, 0, 1);
}
`;


const program = makeProgram(vertexShaderSource, fragmentShaderSource);

const quad = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1,
]);

const positionLocation = gl.getAttribLocation(program, "position");
makeBuffer(quad);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
const { width, height } = gl.canvas;
const resolution = [width, height];

gl.useProgram(program);

function draw() {
  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.uniform2fv(resolutionLocation, resolution);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(draw);
}

draw();
