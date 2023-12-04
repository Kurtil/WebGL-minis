import WebGLUtils from "../webglutils.js";

const gl = WebGLUtils.gl;

const vertexShaderSource = `\
#version 300 es

in vec2 position;
in vec3 color;

out vec3 v_color;

void main()
{
    v_color = color;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `\
#version 300 es
precision mediump float;

in vec3 v_color;

out vec4 fragColor;

void main()
{
    fragColor = vec4(v_color, 1.0);
}`;


const program = WebGLUtils.makeProgram(
    vertexShaderSource,
    fragmentShaderSource
);

const positionAndColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionAndColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.5, -0.5,
    1, 0, 0,
    0.5, -0.5,
    0, 1, 0,
    0, 0.5,
    0, 1, 0,
]), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

// RENDERING
gl.useProgram(program);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.drawArrays(gl.TRIANGLES, 0, 3);