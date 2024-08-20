export default `
in vec2 position; // from the instance geometry
in vec2 pA, pB, pC;

uniform vec2 resolution;
uniform float width;

void main() {
  if (position.x == 0.0) {
    vec2 xBasis = pB - pA;
    vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
    vec2 point = pA + xBasis * position.x + yBasis * width * position.y;

    vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;
    gl_Position = vec4(clipPosition, 0, 1);
    return;
  }

  // Find the normal vector.
  vec2 tangent = normalize(normalize(pC - pB) + normalize(pB - pA));
  vec2 normal = vec2(-tangent.y, tangent.x);

  // Find the perpendicular vectors.
  vec2 ab = pB - pA;
  vec2 cb = pB - pC;
  vec2 abNorm = normalize(vec2(-ab.y, ab.x));

  // Determine the bend direction.
  float sigma = sign(dot(ab + cb, normal));

  if (sign(position.y) == -sigma) {
    // This is an intersecting vertex. Adjust the position so that there's no overlap.
    vec2 position = 0.5 * normal * -sigma * width / dot(normal, abNorm);

    vec2 clipPosition = ((pB + position) * 2.0 - resolution) / resolution.y;
    gl_Position = vec4(clipPosition, 0, 1);
  } else {
    // This is a non-intersecting vertex. Treat it normally.
    vec2 xBasis = pB - pA;
    vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
    vec2 point = pA + xBasis * position.x + yBasis * width * position.y;

    vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;
    gl_Position = vec4(clipPosition, 0, 1);
  }
}
`;