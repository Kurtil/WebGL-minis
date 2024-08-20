export default `
precision highp float;

flat in int v_index;

in vec2 start_position;
in vec2 end_position;
in vec2 point_position;

uniform float line_width;
 
out vec4 outColor;

float distanceToSegment(vec2 p, vec2 segmentStart, vec2 segmentEnd) {
  vec2 v = segmentEnd - segmentStart;
  vec2 w = p - segmentStart;

  float c1 = dot(w, v);
  if (c1 <= 0.) {
    return distance(p, segmentStart);
  }

  float c2 = dot(v, v);
  if (c2 <= c1) {
    return distance(p, segmentEnd);
  }

  float b = c1 / c2;
  vec2 pb = segmentStart + b * v;
  return distance(p, pb);
}

void main() {
  float line_width = line_width / 2.;
  float d = distanceToSegment(point_position, start_position, end_position);

  outColor = vec4(float(v_index) / 4., 0, 0, 1);
  if (d - line_width > 0.) {
    // anti-aliasing
    outColor.a = 1. - (d - line_width);
  }
}
`;