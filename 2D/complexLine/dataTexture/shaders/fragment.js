export default `
precision highp float;

flat in int v_index;

in float distance_to_segment;
in float half_line_width;
 
out vec4 outColor;

void main() {
  float d = abs(distance_to_segment);

  outColor = vec4(float(v_index) / 4., 0, 0, 1);
  if (d - half_line_width > 0.) {
    // anti-aliasing
    outColor.a = 1. - (d - half_line_width);
  }
}
`;