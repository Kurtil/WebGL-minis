export default `
in vec2 point;

uniform vec2 resolution;
uniform float pointSize;

void main() {
  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;

  gl_PointSize = pointSize;
  gl_Position = vec4(clipPosition, 0, 1);
}
`;
