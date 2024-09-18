import { gl as GL, makeProgram, makeBuffer } from "webglutils";

/**
 * @type {WebGL2RenderingContext}
 */
const gl = GL;

const vertexShaderSource = `
in uint index;

uniform Data {
    vec2 points[4];
} data;

void main()
{
    gl_Position = vec4(data.points[index], 0, 1);
}
`;

const fragmentShaderSource = `
precision highp float;

out vec4 fragColor;

void main()
{
    fragColor = vec4(0, 0, 0, 1);
}
`;


const program = makeProgram(
    vertexShaderSource,
    fragmentShaderSource
);

makeBuffer(new Uint32Array([
  0, 1, 2, 3
]));

const positionLocation = gl.getAttribLocation(program, "index");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribIPointer(positionLocation, 1, gl.UNSIGNED_INT, 0, 0);

const points = new Float32Array([
    0, 0, /* padding */ 0, 0,
    0.5, 0, /* padding */ 0, 0,
    0.5, 0.5, /* padding */ 0, 0,
    0, 0.5, /* padding */ 0, 0
]);

// UBO
const blockIndex = gl.getUniformBlockIndex(program, "Data");
const dataBindingPoint = 0;
gl.uniformBlockBinding(program, blockIndex, dataBindingPoint);

const data = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, data); // X
// The next line can be used instead of the X lines if only one program using UBO is used. Else, bindBufferBase must be called at rendering time. bindBufferBase binds the buffer to the target (gl.UNIFORM_BUFFER) AND the binding point (dataBindingPoint).
// gl.bindBufferBase(gl.UNIFORM_BUFFER, dataBindingPoint, data);
gl.bufferData(gl.UNIFORM_BUFFER, points, gl.STATIC_DRAW);

// RENDERING
gl.useProgram(program);

gl.bindBufferBase(gl.UNIFORM_BUFFER, dataBindingPoint, data); // X

gl.drawArrays(gl.LINE_LOOP, 0, 4);
