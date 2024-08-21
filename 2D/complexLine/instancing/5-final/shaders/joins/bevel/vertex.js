export default `
in vec3 position; // position coefficients from the instance geometry
in vec2 p0;
in vec2 p1;
in vec2 p2;

uniform vec2 resolution;
uniform float width;

void main() {
  vec2 tangent = normalize(normalize(p1 - p0) + normalize(p2 - p1));
  vec2 normal = vec2(-tangent.y, tangent.x);

  vec2 ab = p1 - p0;
  vec2 cb = p1 - p2;
  vec2 abn = normalize(vec2(-ab.y, ab.x));
  vec2 cbn = -normalize(vec2(-cb.y, cb.x));

  float bendSign = sign(dot(ab, normal));

  vec2 point0 = 0.5 * bendSign * width * (bendSign < 0.0 ? abn : cbn);
  vec2 point1 = 0.5 * bendSign * width * (bendSign < 0.0 ? cbn : abn);
  vec2 point2 = -0.5 * normal * bendSign * width / dot(normal, abn);
  vec2 point = p1 + position.x * point0 + position.y * point1 + position.z * point2;

  // projection
  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;
  gl_Position = vec4(clipPosition, 0, 1);
}
`;