import { gl, makeProgram, makeBuffer } from "../../../webglutils.js";

const vertexShaderSource = `
in vec4 position;
in vec2 texcoord;

out vec2 v_texcoord;

void main()
{
    gl_Position = position;
    v_texcoord = texcoord;
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


const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const textureLocation = gl.getUniformLocation(program, "u_texture");

/*** TEXTURE ***/
function generateRandomTextureData(size) {
  const totalSize = size * size * 3;
  const data = new Uint8Array(totalSize);
  for (let i = 0; i < totalSize; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  return data;
}

const texture = gl.createTexture();
const textureUnit = 6;
gl.activeTexture(gl.TEXTURE0 + textureUnit);
gl.bindTexture(gl.TEXTURE_2D, texture);

const texuteDataSize = 5;
const textureData = generateRandomTextureData(texuteDataSize);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); // seems mandatory to make texture with size not power of 4
// TODO read https://stackoverflow.com/questions/11042027/glpixelstoreigl-unpack-alignment-1-disadvantages and https://www.khronos.org/opengl/wiki/Pixel_Transfer#Pixel_layout
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texuteDataSize, texuteDataSize, 0, gl.RGB, gl.UNSIGNED_BYTE, textureData);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4); // Default value

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // Mandatory because default value use bitmap that are not generated here
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

/*** POSITION ***/
makeBuffer(new Float32Array([
  -0.5, -0.5,
  0.5, -0.5,
  0, 0.5,
]));

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

makeBuffer(new Float32Array([
  0, 0,
  1, 0,
  0.5, 1,
]));

/*** TEXTURE COORDINATE ***/
const texcoordLocation = gl.getAttribLocation(program, "texcoord");
gl.enableVertexAttribArray(texcoordLocation);
gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

/*** RENDERING ***/
gl.useProgram(program);

gl.uniform1i(textureLocation, textureUnit);

gl.drawArrays(gl.TRIANGLES, 0, 3);