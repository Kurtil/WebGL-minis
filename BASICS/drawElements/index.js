import { gl, makeProgram, makeBuffer } from "webglutils";

const vertexShaderSource = `
in vec2 position;

void main() {
   gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShaderSource = `
precision highp float;
 
out vec4 outColor; 
 
void main() {
   outColor = vec4(0, 1, 1, 1);
}
`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);

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

makeBuffer(positions);

const positionLocation = gl.getAttribLocation(program, "position");

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); // bind the buffer binded to the ARRAY_BUFFER target in the vao

const indices = new Uint8Array([
  0, 1, 2,
  0, 3, 4,
  0, 5, 6,
  0, 7, 8
]);

makeBuffer(indices, gl.STATIC_DRAW, gl.ELEMENT_ARRAY_BUFFER);

gl.useProgram(program);

gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);
