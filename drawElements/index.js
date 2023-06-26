const canvas = document.getElementById("canvas");
/** @type { WebGL2RenderingContext } */
const gl = canvas.getContext("webgl2");

const positions = new Float32Array([
    0, 0, // center
    0, 1, // top
    1, 1, // top right
    1, 0, // right
    1, -1, // ...
    0, -1,
    -1, -1,
    -1, 0,
    -1, 1
]);

const indices = new Uint8Array([
    0, 1, 2,
    0, 3, 4,
    0, 5, 6,
    0, 7, 8
]);

const vertexShaderSource = `\
#version 300 es
in vec2 position;

void main() {
   gl_Position = vec4(position, 0, 1);
}
`

const fragmentShaderSource = `\
#version 300 es
precision highp float;
 
out vec4 outColor; 
 
void main() {
   outColor = vec4(0, 1, 1, 1);
}
`

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, "position");

const positionBuffer = gl.createBuffer();
const indiceBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

gl.useProgram(program);

gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);



