import { gl, makeProgram, makeBuffer } from "../../webglutils.js";

const vertexShaderSource = `
in vec2 position;
in vec3 color;

out vec3 v_color;

void main()
{
    v_color = color;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

in vec3 v_color;

out vec4 fragColor;

void main()
{
    fragColor = vec4(v_color, 1.0);
}`;


const program = makeProgram(
  vertexShaderSource,
  fragmentShaderSource
);

makeBuffer(new Float32Array([
  -0.5, -0.5, // position
  0.5, -0.5,
  0, 0.5,
]));

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, "color");
// gl.enableVertexAttribArray(colorLocation); // Not enabled and fallback to default value (0, 0, 0)
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
gl.vertexAttrib3fv(colorLocation, new Float32Array([1, 1, 0])); // Change default value to yellow (1, 1, 0)

// RENDERING
gl.useProgram(program);

gl.drawArrays(gl.TRIANGLES, 0, 3);