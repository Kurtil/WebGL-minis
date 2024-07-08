export default `
uniform vec2 resolution;
uniform float frame;

out vec4 fragColor;

const float FOV = 90.0;

void main()
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;

    vec3 rayPosition = vec3(0);

    float cameraDistance = 1.0 / tan(FOV * 0.5 * PI / 180.0);
    vec3 rayTarget = vec3(uv, cameraDistance);
    vec3 rayDir = normalize(rayTarget - rayPosition);

    // initialize a random number state based on frag coord and frame
    uint rngState = uint(uint(gl_FragCoord.x) * uint(1973) + uint(gl_FragCoord.y) * uint(9277) + uint(frame) * uint(26699)) | uint(1);

    vec3 color = getRayColor(rayPosition, rayDir, rngState);

    // Output to screen
    fragColor = vec4(color, 1.0);
}`
;