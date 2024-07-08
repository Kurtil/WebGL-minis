import { gl, makeBuffer, makeProgram } from "../../utils/webglutils.js";
import loadImage from "../../utils/image.js";

const images = await Promise.all([
  "assets/cubeMapTexture/posx.png",
  "assets/cubeMapTexture/negx.png",
  "assets/cubeMapTexture/posy.png",
  "assets/cubeMapTexture/negy.png",
  "assets/cubeMapTexture/posz.png",
  "assets/cubeMapTexture/negz.png",
].map(loadImage));

import fragmentShaderSource from "./shaders/fragment/index.js";

import vertexShaderSource from "./shaders/vertex/vertex.js";

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
const frameLocation = gl.getUniformLocation(program, "frame");
const texLocation = gl.getUniformLocation(program, "tex");
const skyboxLocation = gl.getUniformLocation(program, "skybox");

const { width, height } = gl.canvas;
const resolution = [width, height];
let frame = 0;

const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0 + 4);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);

const cubeMap = gl.createTexture();
gl.activeTexture(gl.TEXTURE0 + 5);
gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
const { width: imageWidth, height: imageHeight } = images[0];
gl.texStorage2D(gl.TEXTURE_CUBE_MAP, 1, gl.RGBA8, imageWidth, imageHeight);
gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, 0, 0, imageWidth, imageHeight, gl.RGBA, gl.UNSIGNED_BYTE, images[0]);
gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, 0, 0, imageWidth, imageHeight, gl.RGBA, gl.UNSIGNED_BYTE, images[1]);
gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, 0, 0, imageWidth, imageHeight, gl.RGBA, gl.UNSIGNED_BYTE, images[2]);
gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, 0, 0, imageWidth, imageHeight, gl.RGBA, gl.UNSIGNED_BYTE, images[3]);
gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, 0, 0, imageWidth, imageHeight, gl.RGBA, gl.UNSIGNED_BYTE, images[4]);
gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, 0, 0, imageWidth, imageHeight, gl.RGBA, gl.UNSIGNED_BYTE, images[5]);

gl.useProgram(program);

function draw() {
  gl.viewport(0, 0, width, height);

  gl.uniform2fv(resolutionLocation, resolution);
  gl.uniform1f(frameLocation, frame++);
  gl.uniform1i(texLocation, 4);
  gl.uniform1i(skyboxLocation, 5);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.activeTexture(gl.TEXTURE0 + 4);
  gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, width, height);

  requestAnimationFrame(draw);
}

draw();
