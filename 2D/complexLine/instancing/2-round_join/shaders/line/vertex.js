export default `
in vec2 position; // from the instance geometry
in vec2 pointA;   // start of the line segment
in vec2 pointB;   // end of the line segment

uniform vec2 resolution;
uniform float width;

void main() {
  vec2 segment = pointB - pointA;
  vec2 normal = normalize(vec2(-segment.y, segment.x));

  vec2 point = pointA + segment * position.x + normal * position.y * width;

  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;

  gl_Position = vec4(clipPosition, 0, 1);
}
`;