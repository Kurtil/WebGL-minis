export default `
precision highp float;

in vec2 point;
in vec2 normal;
out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0, .5);
}
`;