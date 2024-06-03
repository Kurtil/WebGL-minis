import { gl, makeBuffer, makeProgram } from "../../../utils/webglutils.js";

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
uniform float time;

#define RAY_MARCHING_STEPS 100

float CLOSTEST = 0.001; // close enough to the scene
float FARTEST = 100.; 

// distance to the scene
float map(vec3 p) {
  return length(p) - 1.; // sphere with radius 1, located at origin
}
 
void main() {
  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;

  vec3 ro = vec3(0, 0, -3);         // ray origin
  vec3 rd = normalize(vec3(uv, 1)); // ray direction
  vec3 col = vec3(0);               // accumulated color

  float t = 0.; // distance traveled by ray 

  // ray marching
  for (int i = 0; i < RAY_MARCHING_STEPS ; i++) {
    vec3 p = ro + rd * t;

    float d = map(p); // distance to the scene

    t += d; // move along the ray 

    // col = vec3(i) / 80.; // color based on the number of steps, TESTING 

    if (d < CLOSTEST || d > FARTEST) break; // early exit
  }

  // Colouring
  col = vec3(t * .2); // white color

  color = vec4(col, 1);
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

const start = performance.now();
let time = 0
const timeLocation = gl.getUniformLocation(program, "time");

gl.useProgram(program);

function draw() {
  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.uniform2fv(resolutionLocation, resolution);

  time = (performance.now() - start) / 1000;
  gl.uniform1f(timeLocation, time);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(draw);
}

draw();
