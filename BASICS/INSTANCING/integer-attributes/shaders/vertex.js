export default `
in ivec2 vertexOffset;
in uvec2 position;

uniform vec2 resolution;
uniform float size;

void main() {
  vec2 offset = vec2(vertexOffset) * size;
  vec2 offsetPosition = vec2(position) + offset;

  vec2 clipPosition = (offsetPosition * 2.0 - resolution) / resolution.y;
  clipPosition.y *= -1.0;

  gl_Position = vec4(clipPosition, 0, 1);
}
`;