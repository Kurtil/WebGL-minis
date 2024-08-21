export default `
precision highp float;

in vec2 vOrigin;
in vec2 vPoint;
in vec2 vMiter;

uniform float width;

out vec4 outColor;

void main() {
  vec2 vector = vPoint - vOrigin;

  outColor = vec4(0, 0, 0, .5);
  if (dot(vector, vMiter) > 0. && length(vector) > width / 2.) {
    outColor.a = 0.;
  }
}
`;