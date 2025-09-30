const canvas = document.getElementsByTagName('canvas')[0];

const gl = canvas.getContext('webgl2', { antialias: false });
if (!gl) throw new Error('WebGL2 not supported');

// --- SHADERS ---
const vsSource = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
const fsSource = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  outColor = vec4(1.0, 0.5, 0.2, 1.0);
}
`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

const vs = compileShader(gl.VERTEX_SHADER, vsSource);
const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}
gl.useProgram(program);

// --- TRIANGLE DATA ---
const vertices = new Float32Array([
  -0.8, -0.8,
   0.8, -0.8,
   0.0,  0.8
]);
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

// --- MSAA FRAMEBUFFER SETUP ---
const samples = 4; // 4x MSAA

// Create framebuffer
const msaaFbo = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, msaaFbo);

// Create multisampled color renderbuffer
const colorRb = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, colorRb);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA8, canvas.width, canvas.height);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRb);

// Create multisampled depth renderbuffer (optional, but good practice)
const depthRb = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, depthRb);
gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRb);

// Check framebuffer status
if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  throw new Error('Incomplete MSAA framebuffer');
}

// --- RENDER TO MSAA FRAMEBUFFER ---
gl.bindFramebuffer(gl.FRAMEBUFFER, msaaFbo);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// --- BLIT (RESOLVE) TO SINGLE-SAMPLED FRAMEBUFFER ---
// Create single-sampled framebuffer and texture
const resolveFbo = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, resolveFbo);

const resolveTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, resolveTex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resolveTex, 0);

if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
  throw new Error('Incomplete resolve framebuffer');
}

// Blit from MSAA framebuffer to resolve framebuffer
gl.bindFramebuffer(gl.READ_FRAMEBUFFER, msaaFbo);
gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, resolveFbo);
gl.blitFramebuffer(
  0, 0, canvas.width, canvas.height,
  0, 0, canvas.width, canvas.height,
  gl.COLOR_BUFFER_BIT, gl.NEAREST
);

// --- DRAW RESOLVED TEXTURE TO DEFAULT FRAMEBUFFER ---
// Create a simple textured quad program
const quadVsSource = `#version 300 es
in vec2 aPosition;
out vec2 vTexCoord;
void main() {
  vTexCoord = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
const quadFsSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
uniform sampler2D uTex;
out vec4 outColor;
void main() {
  outColor = texture(uTex, vTexCoord);
}
`;

function createProgram(vsSrc, fsSrc) {
  const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog));
  }
  return prog;
}

const quadProgram = createProgram(quadVsSource, quadFsSource);
const quadVertices = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
   1,  1,
]);
const quadVbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

const quadPosLoc = gl.getAttribLocation(quadProgram, 'aPosition');
gl.useProgram(quadProgram);
gl.enableVertexAttribArray(quadPosLoc);
gl.vertexAttribPointer(quadPosLoc, 2, gl.FLOAT, false, 0, 0);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, resolveTex);
gl.uniform1i(gl.getUniformLocation(quadProgram, 'uTex'), 0);

gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

// --- RENDER FUNCTION WITH MSAA TOGGLE ---
function render(msaaEnabled) {
  if (msaaEnabled) {
    // --- RENDER TO MSAA FRAMEBUFFER ---
    gl.bindFramebuffer(gl.FRAMEBUFFER, msaaFbo);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // --- BLIT (RESOLVE) TO SINGLE-SAMPLED FRAMEBUFFER ---
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, msaaFbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, resolveFbo);
    gl.blitFramebuffer(
      0, 0, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height,
      gl.COLOR_BUFFER_BIT, gl.NEAREST
    );

    // --- DRAW RESOLVED TEXTURE TO DEFAULT FRAMEBUFFER ---
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(quadProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
    gl.enableVertexAttribArray(quadPosLoc);
    gl.vertexAttribPointer(quadPosLoc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, resolveTex);
    gl.uniform1i(gl.getUniformLocation(quadProgram, 'uTex'), 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  } else {
    // --- DIRECT RENDER TO CANVAS (NO AA) ---
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

// Initial render
const aaToggle = document.getElementById('aa-toggle');
render(aaToggle.checked);

// Listen for toggle changes
aaToggle.addEventListener('change', () => {
  render(aaToggle.checked);
});