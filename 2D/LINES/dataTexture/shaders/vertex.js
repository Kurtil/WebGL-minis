export default `
uniform sampler2D positionTexture;

flat out int v_index;

out float half_line_width;
out float distance_to_segment;

uniform float line_width;

uniform mat3 matrix;

void main() {
  int pointIndex = gl_VertexID / 2;

  half_line_width  = line_width / 2.;

  v_index = gl_VertexID;

  vec2 currentPosition = texelFetch(positionTexture, ivec2(pointIndex, 0), 0).rg;
  vec2 adjacentPosition = texelFetch(positionTexture, ivec2(pointIndex + 1, 0), 0).rg;

  vec2 normal = normalize(vec2(currentPosition.y - adjacentPosition.y, adjacentPosition.x - currentPosition.x));

  float signMultiplier = (gl_VertexID == 0 || gl_VertexID == 3) ? 1.0 : -1.0;
  normal *= signMultiplier;

  vec2 position = currentPosition + normal * (half_line_width + 1.);

  distance_to_segment = (half_line_width + 1.) * ((gl_VertexID == 0 || gl_VertexID == 2) ? 1.0 : -1.0);

  vec2 worldPosition = (matrix * vec3(position, 1)).xy;

  gl_Position = vec4(worldPosition, 0, 1);
}
`;