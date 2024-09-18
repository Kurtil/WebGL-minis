export default `
in uint pointAIndex;
in uint pointBIndex;

uniform sampler2D points;

uniform vec2 resolution;
uniform float width;
uniform float aaOffset;

flat out float vHalfWidth;
out vec2 vPoint;
out vec2 vSegment;

void main() {
  if (pointAIndex == 0u || pointBIndex == 0u) {
    gl_Position = vec4(0, 0, 0, 1); // discard
    return;
  }

  // update width to handle anti-aliasing
  float aaWidth = width + aaOffset * 2.0;

  float x1 = texelFetch(points, ivec2(pointAIndex - 1u, 0), 0).x;
  float y1 = texelFetch(points, ivec2(pointAIndex - 1u, 0), 0).y;
  float x2 = texelFetch(points, ivec2(pointBIndex - 1u, 0), 0).x;
  float y2 = texelFetch(points, ivec2(pointBIndex - 1u, 0), 0).y;

  vec2 pointA = vec2(x1, y1);
  vec2 pointB = vec2(x2, y2);

  /**
   * Dynamically calculate the position of the instance vertex
   * 
   *  (0, 0.5)  0 _________ 3  (1, 0.5) 
   *             |        /|   
   *             |      /  |  
   *             |    /    |  
   *             |  /      |  
   *             |/________|  
   * (0, -0.5)  1           2  (1, -0.5) 
   *
   * Drawn using TRIANGLE_FAN primitive
   */
  vec2 position = vec2(gl_VertexID / 2, float((gl_VertexID -1 & 2) / 2 ) - .5);

  vec2 segment = pointB - pointA;
  vec2 normal = normalize(vec2(-segment.y, segment.x));
  vec2 point = pointA + segment * position.x + normal * position.y * aaWidth;
  
  // point offset for the rounded end
  vec2 direction = normalize(segment);
  float directionSign = sign(position.x - 0.5);
  direction *= directionSign;
  point += direction * aaWidth * 0.5;

  vec2 clipPosition = (point * 2.0 - resolution) / resolution.y;
  gl_Position = vec4(clipPosition, 0, 1);

  vHalfWidth = width / 2.;
  vPoint = point - pointA;
  vSegment = segment;
}
`;