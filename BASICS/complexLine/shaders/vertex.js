export default `
uniform sampler2D positionTexture;

flat out int v_index;

uniform mat3 matrix;

void main() {
  int pointIndex = gl_VertexID / 2;

  v_index = gl_VertexID;

  vec2 currentPosition = texelFetch(positionTexture, ivec2(pointIndex, 0), 0).rg;
  vec2 adjacentPosition = texelFetch(positionTexture, ivec2(pointIndex + 1, 0), 0).rg;

  vec2 normal = normalize(vec2(currentPosition.y - adjacentPosition.y, adjacentPosition.x - currentPosition.x)) * 0.1;

  normal *= pointIndex % 2 == 0 ? 1.0 : -1.0;

  vec2 position = currentPosition + (normal * (float(gl_VertexID % 2) * 2.0 - 1.0));

  vec2 worldPosition = (matrix * vec3(position, 1)).xy;
  gl_Position = vec4(worldPosition, 0, 1);
}
`;