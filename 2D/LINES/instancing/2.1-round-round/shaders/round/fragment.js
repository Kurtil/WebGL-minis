export default `
precision highp float;

in vec2 v_point;

uniform float width;
uniform vec2 resolution;

out vec4 outColor;

void main() {
  float dist = length(gl_FragCoord.xy - v_point);

  // signed distance function
  float d = dist - width / 2.0;
  float a = 1.0 - step(0.0, d);

  outColor = vec4(0, 0, 0, a);
}
`;