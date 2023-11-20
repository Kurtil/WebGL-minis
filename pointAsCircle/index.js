const vertexShaderSource = `\
#version 300 es

void main()
{
    gl_PointSize = 300.0;
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

const fragmentShaderSource = `\
#version 300 es

precision mediump float;

out vec4 fragColor;

void main()
{
    vec2 centeredPointCoord = gl_PointCoord - vec2(0.5, 0.5);
    float distance = length(centeredPointCoord);
    if (distance > 0.5) {
        discard;
    }
    fragColor = vec4(gl_PointCoord, 0.0, 1.0);
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

gl.drawArrays(gl.POINTS, 0, 1);