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
  uniform highp isampler2D normalTexture;

  vec3 lightDirection = vec3(0.0, 1.0, 0.0);

  float unpackIntToFloat(int value) {
    return float(value) / 2147483647.0;
}
  
  void main() {
    // Convert the integer normal data to float
    ivec3 packedNormal = texture(normalTexture, v_uv).rgb;
    vec3 normal;
    normal.x = unpackIntToFloat(packedNormal.x);
    normal.y = unpackIntToFloat(packedNormal.y);
    normal.z = unpackIntToFloat(packedNormal.z);
    normal = normalize(normal);
  
    float lightIntensity = dot(normal, lightDirection);
    lightIntensity = clamp(lightIntensity, 0.0, 1.0);

    vec4 baseColor = texture(colorTexture, v_uv);
    baseColor.rgb *= lightIntensity;
    color = baseColor;
  }
  `;

  const program = makeProgram(vertexShaderSource, fragmentShaderSource);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionLocation = gl.getAttribLocation(program, "position");
  const uvLocation = gl.getAttribLocation(program, "uv");

  const colorTextureLocation = gl.getUniformLocation(program, "colorTexture");
  const normalTextureLocation = gl.getUniformLocation(program, "normalTexture");

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

  const colorTextureUnit = 4;
  gl.uniform1i(colorTextureLocation, colorTextureUnit);
  const normalTextureUnit = 5;
  gl.uniform1i(normalTextureLocation, normalTextureUnit);

  return (colorTexture, normalTexture) => {
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.activeTexture(gl.TEXTURE0 + colorTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.activeTexture(gl.TEXTURE0 + normalTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, normalTexture);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };
}