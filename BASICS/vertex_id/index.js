import { gl, makeProgram, makeBuffer } from "webglutils";

const vertexShaderSource = `
in vec2 position;
flat out int vertexID;

void main()
{
    vertexID = gl_VertexID;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision highp float;

flat in int vertexID;

out vec4 fragColor;

void main()
{
    vec3 color = vertexID == 1 ? vec3(1.0, 0.0, 0.0) : vertexID == 2 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0);
    fragColor = vec4(color,
        1.0
    );
}`;


const program = makeProgram(
    vertexShaderSource,
    fragmentShaderSource
);

makeBuffer(new Float32Array([
  -0.5, -0.5,
  0.5, -0.5,
  0, 0.5,
]));

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// RENDERING
gl.useProgram(program);

gl.drawArrays(gl.LINE_LOOP, 0, 3);