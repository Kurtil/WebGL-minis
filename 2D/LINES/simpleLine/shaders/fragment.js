export default `
precision highp float;

flat in float vHalfWidth;
in vec2 vPoint;
in vec2 vSegment;

out vec4 outColor;

/**
 * Signed distance to a segment - Inigo Quilez
 * https://iquilezles.org/articles/distfunctions2d/
 **/
float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

void main() {
  float d = sdSegment(vPoint, vec2(0, 0), vSegment);
  float alpha = step(0.0, d - vHalfWidth);
  outColor = vec4(0, 0, 0, 1. - alpha);
}
`;