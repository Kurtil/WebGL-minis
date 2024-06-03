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

float CLOSTEST = 0.001;
float FARTEST = 100.; 

/**
 * @param {vec3} p - point in space
 * @param {vec3} b - box dimensions
 * @returns {float} - distance from the point to the box
 */
float sdBox(vec3 p, vec3 b) {
  vec3 d = abs(p) - b;
  return length(max(d, 0.)) + min(max(d.x, max(d.y, d.z)), 0.);
}

float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * .57735027;
}

vec3 palette(float t) {
  return .5+.5*cos(6.28318*(t+vec3(.3,.416,.557)));
}

/**
 * Rotation matrix
 * To use in 3D, omit the component of the axis you want to rotate around.
 * ex: vector.xy *= rot(angle); 
 * 
 * @param {float} a - angle
 * @returns {mat2} - rotation matrix
 */
mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

/**
 * distance to the scene
 * @param {vec3} p - point in space
 * @returns {float} - distance to the scene
 */ 
float map(vec3 p) {
  p.z += time * .4;
 
  p = fract(p) - .5; // tiling

  p.xy *= rot(time);

  float box = sdOctahedron(p, .03);

  return box;
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

    if (d < CLOSTEST || d > FARTEST) break; // early exit
  }

  // Colouring
  col = palette(t * .05); // white color

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
