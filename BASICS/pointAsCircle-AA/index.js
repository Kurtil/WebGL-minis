import { gl, makeProgram } from "webglutils";

const vertexShaderSource = `
void main()
{
    gl_PointSize = 500.;
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 resolution;

out vec4 fragColor;

void main()
{
    // gl_PointCoord contains the coordinate of a fragment within a point

    vec2 centeredPointNormalized = gl_PointCoord - vec2(0.5, 0.5);
    vec2 centeredPointCoord = centeredPointNormalized * resolution;
    float distance = length(centeredPointCoord);
    // Define the edge distance for anti-aliasing
    const float edgeDistance = 250.0 / 2.0; // Circle radius
    const float aaRange = 1.0; // Anti-aliasing range

    const int aaType = 1; // 0: Smoothstep AA, 1: Gaussian AA, 2: None

    if (distance > edgeDistance ) {
        if (aaType == 0) {
            // Smoothstep AA
            float alpha = 1. - smoothstep(edgeDistance, edgeDistance + aaRange, distance);
            fragColor = vec4(0, 0, 0, alpha);
            return;
        } else if (aaType == 1) {
            // Gaussian AA
            float sigma = aaRange * .6; // .6 seems to be pretty close to the canvas 2D context circle
            float alpha = exp(-0.5 * pow((distance - edgeDistance) / sigma, 2.));
            fragColor = vec4(0, 0, 0, alpha);
            return;
        } else {
            if (distance <= edgeDistance) {
                fragColor = vec4(0, 0, 0.0, 1.0 - (distance - edgeDistance) / aaRange);
            } else {
                discard;
            }
        }
    } else {
        fragColor = vec4(0, 0, 0.0, 1.0);
    }
}`;

const program = makeProgram(vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const resolutionLocation = gl.getUniformLocation(program, "resolution");
gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

gl.drawArrays(gl.POINTS, 0, 1);

// canvas 2D circle comparison

const canvas = document.getElementById("canvas-2d");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const x = canvas.width / 2;
const y = canvas.height / 2;
const radius = 250 / 2;
const startAngle = 0;
const endAngle = Math.PI * 2;
const counterclockwise = false;

ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

ctx.fill();
