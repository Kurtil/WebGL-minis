export default `
precision highp float;

in vec2 vMiter;
in vec2 vOrigin;
in vec2 vPoint;

uniform float miterLimit;

out vec4 outColor;

void main() {
  // add miter limit
  vec2 vector = vPoint - vOrigin;

  outColor = vec4(0, 0, 0, .5);
  if (dot(vector, vMiter) > miterLimit) {
    outColor.a = 0.;
  }
}
`;