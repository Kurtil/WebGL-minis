export default `
in vec2 position; // from the instance geometry
in uint pointAIndex;
in uint pointBIndex;

uniform sampler2D points;

uniform vec2 resolution;
uniform float width;

void main() {
  if (pointAIndex == 0u || pointBIndex == 0u) {
    gl_Position = vec4(0, 0, 0, 1); // discard
    return;
  }

  float x1 = texelFetch(points, ivec2(pointAIndex - 1u, 0), 0).x;
  float y1 = texelFetch(points, ivec2(pointAIndex - 1u, 0), 0).y;
  float x2 = texelFetch(points, ivec2(pointBIndex - 1u, 0), 0).x;
  float y2 = texelFetch(points, ivec2(pointBIndex - 1u, 0), 0).y;

  vec2 pointA = vec2(x1, y1);
  vec2 pointB = vec2(x2, y2);

  vec2 segment = pointB - pointA;
  vec2 normal = normalize(vec2(-segment.y, segment.x));

  vec2 point = pointA + segment * position.x + normal * position.y * width;

  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;

  gl_Position = vec4(clipPosition, 0, 1);
}
`;