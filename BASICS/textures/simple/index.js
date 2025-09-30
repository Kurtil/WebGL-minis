import { gl as GL, makeProgram, makeBuffer } from "webglutils";

/** @type {WebGL2RenderingContext} */
const gl = GL;

const DATA_FROM_PIXEL_BUFFER = false;

console.log("DATA_FROM_PIXEL_BUFFER : ", DATA_FROM_PIXEL_BUFFER);

const vertexShaderSource = `
in vec4 position;
in vec2 texcoord;

out vec2 v_texcoord;

uniform float scale;

void main()
{
    gl_Position = position;
    v_texcoord = texcoord * scale;
}`;

const fragmentShaderSource = `
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 fragColor;

void main()
{
    fragColor = texture(u_texture, v_texcoord);
}`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

const textureLocation = gl.getUniformLocation(program, "u_texture");
const scaleLocation = gl.getUniformLocation(program, "scale");

const img = new Image();
img.src = "./texture.svg";

const texture = gl.createTexture();
const textureUnit = 6;
gl.activeTexture(gl.TEXTURE0 + textureUnit);
gl.bindTexture(gl.TEXTURE_2D, texture);

const draw = (scale = 40) => {
  gl.uniform1i(textureLocation, textureUnit);
  gl.uniform1f(scaleLocation, scale);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
};

img.onload = () => {
  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, img.width, img.height);
  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,
    0,
    0,
    img.width,
    img.height,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    img
  );

  // gl.texImage2D(
  //   gl.TEXTURE_2D,
  //   0,
  //   gl.RGBA,
  //   img.width,
  //   img.height,
  //   0,
  //   gl.RGBA,
  //   gl.UNSIGNED_BYTE,
  //   img
  // );

  gl.generateMipmap(gl.TEXTURE_2D);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  /*** POSITION ***/
  makeBuffer(new Float32Array([
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5, 
    -0.5, 0.5,
  ]));

  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  makeBuffer(new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1,
  ]));

  /*** TEXTURE COORDINATE ***/
  const texcoordLocation = gl.getAttribLocation(program, "texcoord");
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  /*** RENDERING ***/
  gl.useProgram(program);

  draw();
};

document.getElementById("scale").addEventListener("input", (e) => {
  e.preventDefault();
  draw(+e.target.value);
});
