export default `
out vec4 fragColor;

void main()
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;

    vec3 origin = vec3(-1, 1, -3);
    vec3 pixelTarget = vec3(uv, 0);
    vec3 direction = normalize(pixelTarget - origin);

    Ray ray = Ray(origin, direction);

    vec3 color = vec3(0);

    for (int i = 0; i < SAMPLES; i++) {
        color += trace(ray, random(vec3(uv, 1), time + float(i) / float(SAMPLES)));
    }

    color /= float(SAMPLES);

    // Output to screen
    fragColor = vec4(color,1.0);
}`
;