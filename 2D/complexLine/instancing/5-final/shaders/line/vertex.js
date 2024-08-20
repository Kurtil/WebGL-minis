export default `
in vec2 position; // from the instance geometry
in vec2 pA, pB, pC, pD;

uniform vec2 resolution;
uniform float width;

void main() {
  vec2 p0 = pA;
  vec2 p1 = pB;
  vec2 p2 = pC;

  vec2 pos = position;

  if (position.x == 1.0) { // to the right of the instance geometry line
    p0 = pD;
    p1 = pC;
    p2 = pB;
    pos = vec2(1.0 - position.x, -position.y);
  }

  // Find the normal vector.
  vec2 tangent = normalize(normalize(p2 - p1) + normalize(p1 - p0));
  vec2 normal = vec2(-tangent.y, tangent.x);

  // Find the vector perpendicular to p0 -> p1.
  vec2 p01 = p1 - p0;
  
  // Determine the bend direction.
  float sigma = sign(dot(p01, normal));
  
  vec2 point;
  if (sign(pos.y) == -sigma) {
    // This is an intersecting vertex. Adjust the position so that there's no overlap.
    vec2 p01Norm = normalize(vec2(-p01.y, p01.x));
    point = 0.5 * normal * -sigma * width / dot(normal, p01Norm);
    point += p1;
  } else {
    // This is a non-intersecting vertex. Treat it normally.
    vec2 xBasis = p2 - p1;
    vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
    point = p1 + xBasis * pos.x + yBasis * width * pos.y;
  }

  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;

  gl_Position = vec4(clipPosition, 0, 1);
}
`;