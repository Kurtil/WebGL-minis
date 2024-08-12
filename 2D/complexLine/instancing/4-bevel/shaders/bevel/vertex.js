export default `
in vec2 position; // position coefficients from the instance geometry
in vec2 pointA;
in vec2 pointB;
in vec2 pointC;

uniform vec2 resolution;
uniform float width;

void main() {
  vec2 tangent = normalize(normalize(pointB - pointA) + normalize(pointC - pointB));
  vec2 normal = vec2(-tangent.y, tangent.x);

  vec2 ab = pointB - pointA;
  vec2 cb = pointB - pointC;
  vec2 abNorm = normalize(vec2(-ab.y, ab.x));
  vec2 cbNorm = -normalize(vec2(-cb.y, cb.x));

  float bendSign = sign(dot(ab, normal));

  vec2 p0 = 0.5 * width * bendSign * (bendSign < 0.0 ? abNorm : cbNorm);
  vec2 p1 = 0.5 * width * bendSign * (bendSign < 0.0 ? cbNorm : abNorm);

  vec2 point = pointB + position.x * p0 + position.y * p1;

  // projection
  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;
  gl_Position = vec4(clipPosition, 0, 1);
}
`;