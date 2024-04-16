import { gl, makeProgram, makeBuffer } from "webglutils";

export default function makeQuadProgram() {
  const vertexShaderSource = `
  in vec2 position;

  out vec2 v_uv_position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    v_uv_position = (gl_Position.xy + 1.) / 2.;
  }
  `;

  const fragmentShaderSource = `
  precision highp float;
  
  out vec4 color;

  in vec2 v_uv_position;
  
  uniform sampler2D colorTexture;
  
  void main() {
    color = texture(colorTexture, v_uv_position);
  }
  `;

  const program = makeProgram(vertexShaderSource, fragmentShaderSource);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionLocation = gl.getAttribLocation(program, "position");

  const colorTextureLocation = gl.getUniformLocation(program, "colorTexture");

  const positions = new Float32Array([
    -1, -1,
    1, -1,
    1, 1,
    -1, 1,
  ]);

  makeBuffer(positions);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  const colorTextureUnit = 4;
  gl.uniform1i(colorTextureLocation, colorTextureUnit);

  return (colorTexture, vertexIdTexture) => {
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.activeTexture(gl.TEXTURE0 + colorTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };
}