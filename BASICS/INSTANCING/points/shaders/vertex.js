export default `
void main() {
  float x = gl_VertexID == 0 || gl_VertexID == 2 ? -.5 : .5;
  float y = gl_VertexID < 2 ? -.5 : .5;

  // gl_PointSize = 10.0;

  gl_Position = vec4(x, y, 0, 1);
}
`;