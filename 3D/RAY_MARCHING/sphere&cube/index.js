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
uniform vec2 mouse;
uniform float time;

#define RAY_MARCHING_STEPS 100

float CLOSTEST = 0.001;
float FARTEST = 100.; 
float MOUSE_SENSITIVITY = 3.;

/**
 * @param {vec3} p - point in space
 * @param {float} r - radius of the sphere
 * @returns {float} - distance from the point to the sphere
 */
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

/**
 * @param {vec3} p - point in space
 * @param {vec3} b - box dimensions
 * @returns {float} - distance from the point to the box
 */
float sdBox(vec3 p, vec3 b) {
  vec3 d = abs(p) - b;
  return length(max(d, 0.)) + min(max(d.x, max(d.y, d.z)), 0.);
}

// OPERATORS

/**
 * Standard operators
 * @param {float} d1 - distance to the first object
 * @param {float} d2 - distance to the second object
 * @returns {float} - distance to the closest object
 */

// Union
float opU(float d1, float d2) {
  return min(d1, d2);
}

// Subtraction  
float opS(float d1, float d2) {
  return max(-d1, d2);
}

// Intersection
float opI(float d1, float d2) {
  return max(d1, d2);
}

/**
 * Smooth operators
 * @param {float} d1 - distance to the first object
 * @param {float} d2 - distance to the second object
 * @param {float} k - blending factor
 * @returns {float} - distance to the closest object
 */

// Union
float opUs(float d1, float d2, float k) {
  return min(d1, d2) - k * max(d1, d2);
}

// Subtraction
float opSs(float d1, float d2, float k) {
  return max(-d1, d2) + k * max(d1, d2);
}

// Intersection
float opIs(float d1, float d2, float k) {
  return max(d1, d2) + k * min(d1, d2);
}

// Minimum
float smin(float d1, float d2, float k) {
  float h = max(k - abs(d1 - d2), 0.) / k;
  return min(d1, d2) - h * h * k * .25;
}

// Maximum
float smax(float d1, float d2, float k) {
  float h = max(k - abs(d1 - d2), 0.) / k;
  return max(d1, d2) + h * h * k * .25;
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
  vec3 sphereCenter = vec3(sin(time) * 3., 0, 0);
  float sphere = sdSphere(p - sphereCenter, .4);

  vec3 pCopy = p;

  pCopy = fract(p) - .5; // tiling

  pCopy.xy *= rot(time);

  float boxScale = .2;
  float box = sdBox(pCopy / boxScale, vec3(.75)) * boxScale; // multiply by boxScale to fix artifacts  
 
  float ground = p.y + .7;

  return smin(ground, smin(sphere, box, .7), .3);
}
 
void main() {
  vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
  vec2 m = (mouse * 2. - resolution) / resolution.y * MOUSE_SENSITIVITY;

  vec3 ro = vec3(0, 0, -3);         // ray origin
  vec3 rd = normalize(vec3(uv, 1)); // ray direction
  vec3 col = vec3(0);               // accumulated color

  ro.yz *= rot(-m.y);
  rd.yz *= rot(-m.y);

  ro.xz *= rot(-m.x);
  rd.xz *= rot(-m.x);

  float t = 0.; // distance traveled by ray 

  // ray marching
  for (int i = 0; i < RAY_MARCHING_STEPS ; i++) {
    vec3 p = ro + rd * t;

    float d = map(p); // distance to the scene

    t += d; // move along the ray 

    if (d < CLOSTEST || d > FARTEST) break; // early exit
  }

  // Colouring
  col = vec3(t * .05); // white color

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

const mouseLocation = gl.getUniformLocation(program, "mouse");
const mousePosition = { x: width / 2, y: height / 2 };

gl.canvas.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  const { left, top } = gl.canvas.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  mousePosition.x = x;
  mousePosition.y = y;
});

gl.useProgram(program);

function draw() {
  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.uniform2fv(resolutionLocation, resolution);
  gl.uniform2f(mouseLocation, mousePosition.x, mousePosition.y);

  time = (performance.now() - start) / 1000;

  gl.uniform1f(timeLocation, time);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  requestAnimationFrame(draw);
}

draw();
