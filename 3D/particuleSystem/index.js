const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if (!gl) throw new Error('WebGL2 required');

const gravityToggle = document.getElementById('gravity-toggle');
const speedRange = document.getElementById('speed-range');
const countRange = document.getElementById('count-range');
const countLabel = document.getElementById('count-label');

// --- SHADERS ---
const vsUpdateSrc = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_velocity;

uniform float u_speed;
uniform bool u_gravity;
uniform float u_dt;

out vec2 v_position;
out vec2 v_velocity;

void main() {
  vec2 vel = a_velocity;
  if (u_gravity) vel.y -= 0.3 * u_dt;
  v_position = a_position + vel * u_speed * u_dt;
  v_velocity = vel;
}
`;

const vsRenderSrc = `#version 300 es
precision highp float;
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
  gl_PointSize = 2.0;
}
`;

const fsRenderSrc = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  outColor = vec4(1, 0.8, 0.2, 1);
}
`;

// --- PROGRAM HELPERS ---
function createShader(type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
    throw gl.getShaderInfoLog(sh);
  return sh;
}
function createProgram(vsSrc, fsSrc, xfbVaryings) {
  const vs = createShader(gl.VERTEX_SHADER, vsSrc);
  const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  if (xfbVaryings) {
    gl.transformFeedbackVaryings(prog, xfbVaryings, gl.SEPARATE_ATTRIBS);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    throw gl.getProgramInfoLog(prog);
  return prog;
}

// --- PARTICLE BUFFERS ---
let particleCount = parseInt(countRange.value);
let speed = parseFloat(speedRange.value);
let gravity = gravityToggle.checked;

function randomParticles(count) {
  const arr = new Float32Array(count * 4);
  for (let i = 0; i < count; ++i) {
    arr[i * 4 + 0] = (Math.random() * 2 - 1) * 0.5; // x pos
    arr[i * 4 + 1] = (Math.random() * 2 - 1) * 0.5; // y pos
    arr[i * 4 + 2] = (Math.random() * 2 - 1) * 0.02; // x vel
    arr[i * 4 + 3] = (Math.random() * 2 - 1) * 0.02; // y vel
  }
  return arr;
}

let buffers;
let vaos;

function setupBuffers() {
  // Create new buffers and VAOs for ping-pong
  buffers = [
    gl.createBuffer(), gl.createBuffer(), // ping position, ping velocity
    gl.createBuffer(), gl.createBuffer()  // pong position, pong velocity
  ];
  vaos = [gl.createVertexArray(), gl.createVertexArray()];

  let pingData = randomParticles(particleCount);
  let pongData = randomParticles(particleCount);

  for (let i = 0; i < 2; ++i) {
    let data = i === 0 ? pingData : pongData;
    // Position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i * 2]);
    gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, particleCount * 2), gl.DYNAMIC_COPY);
    // Velocity buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i * 2 + 1]);
    gl.bufferData(gl.ARRAY_BUFFER, data.subarray(particleCount * 2), gl.DYNAMIC_COPY);

    gl.bindVertexArray(vaos[i]);
    // Position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i * 2]);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // Velocity attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i * 2 + 1]);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
  }
}
setupBuffers();

// --- PROGRAMS ---
const updateProg = createProgram(vsUpdateSrc, fsRenderSrc, ['v_position', 'v_velocity']);
const renderProg = createProgram(vsRenderSrc, fsRenderSrc);

// --- UNIFORMS ---
const u_speed = gl.getUniformLocation(updateProg, 'u_speed');
const u_gravity = gl.getUniformLocation(updateProg, 'u_gravity');
const u_dt = gl.getUniformLocation(updateProg, 'u_dt');

// --- MAIN LOOP ---
let readIdx = 0, writeIdx = 1;
let lastTime = performance.now();

function step() {
  // --- UPDATE PARTICLES (NO VAO) ---
  gl.useProgram(updateProg);
  gl.enable(gl.RASTERIZER_DISCARD);

  // Bind "read" buffers as attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[readIdx * 2]);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[readIdx * 2 + 1]);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  // Bind "write" buffers for transform feedback
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[writeIdx * 2]);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, buffers[writeIdx * 2 + 1]);

  gl.uniform1f(u_speed, speed);
  gl.uniform1i(u_gravity, gravity ? 1 : 0);
  gl.uniform1f(u_dt, Math.min((performance.now() - lastTime) * 0.001, 0.05));

  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, particleCount);
  gl.endTransformFeedback();

  gl.disable(gl.RASTERIZER_DISCARD);

  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);

  [readIdx, writeIdx] = [writeIdx, readIdx];

  // --- RENDER PARTICLES (USE VAO) ---
  gl.useProgram(renderProg);
  gl.bindVertexArray(vaos[readIdx]);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, particleCount);

  lastTime = performance.now();
  requestAnimationFrame(step);
}
requestAnimationFrame(step);

// --- UI EVENTS ---
gravityToggle.addEventListener('change', () => {
  gravity = gravityToggle.checked;
});
speedRange.addEventListener('input', () => {
  speed = parseFloat(speedRange.value);
});
countRange.addEventListener('input', () => {
  particleCount = parseInt(countRange.value);
  countLabel.textContent = particleCount;
  setupBuffers(); // This now creates new buffers and VAOs
});