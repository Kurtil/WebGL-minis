export default `
precision highp float;

flat in int v_index;

in vec2 v_line_start;
in vec2 v_line_end;

const float small = .01;
const float line_width = 0.1;
 
out vec4 outColor;

float distanceToLine(vec2 start, vec2 end, vec2 point) {
  vec2 line = end - start;
  vec2 pointToStart = point - start;
  vec2 pointToEnd = point - end;
  
  float len = length(line);
  float lengthToStart = dot(line, pointToStart) / len;
  float lengthToEnd = dot(-line, pointToEnd) / len;
  
  if (lengthToStart < 0.0) {
    return length(pointToStart);
  } else if (lengthToEnd < 0.0) {
    return length(pointToEnd);
  } else {
    return abs(dot(normalize(line), vec2(-pointToStart.y, pointToStart.x)));
  }
}
 
void main() {
  vec2 point = gl_FragCoord.xy / vec2(500) * 2.0 - 1.0;
  float d = distanceToLine(v_line_start, v_line_end, point);

  if (d < line_width) {
    outColor = vec4(float(v_index) / 4., 0, 0, 1);
  } else {
    // anti-aliasing
    outColor.a *= smoothstep(line_width, line_width + small, d);
  }
}
`;