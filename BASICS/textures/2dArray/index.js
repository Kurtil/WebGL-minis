import { gl, makeProgram, makeBuffer } from "webglutils";

const MANUAL_ALLOC = true;

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

uniform mediump sampler2DArray u_texture;
uniform float u_textDepth;

out vec4 fragColor;

void main()
{
    fragColor = texture(u_texture, vec3(v_texcoord, u_textDepth));
}`;

const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const textureLocation = gl.getUniformLocation(program, "u_texture");
const textureDepthLocation = gl.getUniformLocation(program, "u_textDepth");

/*** TEXTURE ***/
const texture = gl.createTexture();
const textureUnit = 6;
gl.activeTexture(gl.TEXTURE0 + textureUnit);
gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);

gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

const width = 2;
const height = 2;
const depth = 3;

if (MANUAL_ALLOC) {
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGB8, width, height, depth);

  // Fill the first layer with red pixels
  const layer1 = new Uint8Array([
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
  ]);
  gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 0, width, height, 1, gl.RGB, gl.UNSIGNED_BYTE, layer1);

  // Fill the second layer with green pixels
  const layer2 = new Uint8Array([
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
  ]);
  gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 1, width, height, 1, gl.RGB, gl.UNSIGNED_BYTE, layer2);

  // Fill the third layer with blue pixels
  const layer3 = new Uint8Array([
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
  ]);
  gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, 2, width, height, 1, gl.RGB, gl.UNSIGNED_BYTE, layer3);
} else {
  const textureData = new Uint8Array([
    // Layer 0 - Red
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    // Layer 1 - Green
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    // Layer 2 - Blue
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
  ])

  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGB, width, height, depth, 0, gl.RGB, gl.UNSIGNED_BYTE, textureData);
}

gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4); // Default value

gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // Mandatory because default value use bitmap that are not generated here
gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

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
gl.uniform1f(textureDepthLocation, 0);

gl.drawArrays(gl.TRIANGLES, 0, 3);

let selectedLayer = 0;
setInterval(() => {
  selectedLayer = (selectedLayer + 1) % 3;
  gl.uniform1f(textureDepthLocation, selectedLayer);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}, 1000);
