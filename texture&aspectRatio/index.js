const image = new Image();

await new Promise((resolve, reject) => {
  image.onload = resolve;
  image.onerror = reject;
  image.src = "tree.webp";
});

import WebGLUtils from "../webglutils.js";

const gl = WebGLUtils.gl;

const vertexShaderSource = `\
    #version 300 es
    in vec2 position;
    in vec2 texCoord;

    uniform vec2 u_texture_resolution;
    uniform vec2 u_resolution;

    out vec2 v_texCoord;
    
    void main() {
      v_texCoord = texCoord;

      gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

const fragmentShaderSource = `\
    #version 300 es
    precision highp float;
     
    uniform sampler2D u_texture;
    uniform vec2 u_texture_resolution;
    uniform vec2 u_resolution;

    in vec2 v_texCoord;

    out vec4 outColor; 
     
    void main() {
        float textureAspectRatio = u_texture_resolution.y / u_texture_resolution.x;
        float screenAspectRatio = u_resolution.y / u_resolution.x;

        outColor = texture(u_texture, v_texCoord * vec2(textureAspectRatio / screenAspectRatio, 1.0));
    }
    `;

const program = WebGLUtils.makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

const positionLocation = gl.getAttribLocation(program, "position");
const positions = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
WebGLUtils.createBuffer(positions);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const texCoordLocation = gl.getAttribLocation(program, "texCoord");
const textureCoordinates = new Float32Array([
  0, 0, 1, 0, 1, 1, 0, 1
]);
WebGLUtils.createBuffer(textureCoordinates);
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

const index = new Uint16Array([0, 1, 2, 0, 2, 3]);
WebGLUtils.createBuffer(index, gl.STATIC_DRAW, gl.ELEMENT_ARRAY_BUFFER);

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
// gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

const textureLocation = gl.getUniformLocation(program, "u_texture");
const textureResolutionLocation = gl.getUniformLocation(program, "u_texture_resolution");
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

gl.useProgram(program);

gl.uniform1i(textureLocation, 0);
gl.uniform2f(textureResolutionLocation, image.width, image.height);
gl.uniform2f(resolutionLocation, gl.canvas.clientWidth, gl.canvas.clientHeight);

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

