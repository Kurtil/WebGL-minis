export default `
in vec2 position; // from the instance geometry
in vec2 point;

uniform vec2 resolution;
uniform float width;

out vec2 v_point;

void main() {
  v_point = point;

  vec2 quadPosition = point + (position - .5) * width;

  vec2 clipPosition = (quadPosition * 2.0 - resolution) / resolution.y;
  gl_Position = vec4(clipPosition, 0, 1);
}
`;