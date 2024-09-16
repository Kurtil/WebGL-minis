export default `
uniform sampler2D points;

in uint pointA;
in uint pointB;

in uint isPointB;

flat out uint isDiscard;

uniform vec2 resolution;

void main() {
  if (pointA == 0u || pointB == 0u) {
    // gl_Position = vec4(0, 0, 0, 1); // discard
    isDiscard = 1u;
    return;
  }

  float x1 = texelFetch(points, ivec2(pointA - 1u, 0), 0).x;
  float y1 = texelFetch(points, ivec2(pointA - 1u, 0), 0).y;
  float x2 = texelFetch(points, ivec2(pointB - 1u, 0), 0).x;
  float y2 = texelFetch(points, ivec2(pointB - 1u, 0), 0).y;

  vec2 point = isPointB == 1u ? vec2(x2, y2) : vec2(x1, y1);

  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;

  gl_Position = vec4(clipPosition, 0, 1);
}
`;
