export default `
precision highp float;

flat in float vHalfWidth;
in vec2 vPoint;
in vec2 vSegment;

out vec4 outColor;

/**
 * Signed distance to a segment - Inigo Quilez
 * https://iquilezles.org/articles/distfunctions2d/
 * 
 * Simplified version of the original function due to point and segment being relative from the origin (0, 0).
 **/
float sdSegment( in vec2 point, in vec2 segment )
{
    float h = clamp( dot(point,segment)/dot(segment,segment), 0.0, 1.0 );
    return length( point - segment*h );
}

void main() {
  float d = sdSegment(vPoint, vSegment);
  float alpha = step(0.0, vHalfWidth - d);

  if (alpha == 0.0) {
    discard;
  }

  outColor = vec4(0, 0, 0, alpha);
}
`;