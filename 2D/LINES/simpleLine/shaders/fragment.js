export default `
precision highp float;

flat in float vHalfWidth;
in vec2 vPoint;
in vec2 vSegment;

uniform float aaOffset;

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

  float colorAlpha = 1.;

  if (d < vHalfWidth) {
    outColor = vec4(0, 0, 0, colorAlpha);
    return;
  }

  // AA
  float alpha = 1. - smoothstep(vHalfWidth, vHalfWidth + aaOffset, d);

  outColor = vec4(0, 0, 0, alpha - (1. - colorAlpha));

  gl_FragDepth = 1. - alpha;
}
`;