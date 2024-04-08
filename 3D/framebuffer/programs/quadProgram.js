import { gl, makeProgram, makeBuffer } from "webglutils";

export default function makeQuadProgram() {
  const vertexShaderSource = `
  in vec2 position;
  in vec2 uv;

  out vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
  `;

  const fragmentShaderSource = `
  precision highp float;

  in vec2 v_uv;

  out vec4 color;

  uniform sampler2D colorTexture;

  void main() {
    color = texture(colorTexture, v_uv);
  }
  `;

  const program = makeProgram(vertexShaderSource, fragmentShaderSource);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionLocation = gl.getAttribLocation(program, "position");
  const uvLocation = gl.getAttribLocation(program, "uv");

  const textureLocation = gl.getUniformLocation(program, "colorTexture");

  const positions = new Float32Array([
    -1, -1,
    1, -1,
    1, 1,
    -1, 1,
  ]);

  const uvs = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1,
  ]);

  makeBuffer(positions);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  makeBuffer(uvs);
  gl.enableVertexAttribArray(uvLocation);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  gl.uniform1i(textureLocation, 0);

  return (colorTexture) => {
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };
}