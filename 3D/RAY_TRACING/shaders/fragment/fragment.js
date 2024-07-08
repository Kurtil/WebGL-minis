export default `
precision highp float;

const float INFINITY = 1e10;

float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec3 uniformlyRandomDirection(float seed) {
  float u = random(vec3(12.9898, 78.233, 151.7182), seed);
  float v = random(vec3(63.7264, 10.873, 623.6736), seed);
  float z = 1.0 - 2.0 * u;
  float r = sqrt(1.0 - z * z);
  float angle = 6.283185307179586 * v;
  return vec3(r * cos(angle), r * sin(angle), z);
}

vec3 uniformlyRandomVector(float seed) {
  return uniformlyRandomDirection(seed) * sqrt(random(vec3(36.7539, 50.3658, 306.2759), seed));
}

vec3 randomHemisphereDirection(vec3 normal, float seed) {
    vec3 direction = uniformlyRandomDirection(seed);
    return direction * sign(dot(direction, normal));
}

struct Material {
    vec3 color;
    vec3 emissionColor;
    float emissionStrength;
}; 

struct Sphere {
    vec3 center;
    float radius;
    Material material;
};

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct HitInfo {
    bool isIntersecting;
    float distance;
    vec3 intersection;
    vec3 normal;
    Material material;
};

Sphere spheres[] = Sphere[](
    Sphere(vec3(0, 0, 0), 0.5, Material(vec3(1, 1, .3), vec3(1), 0.05)),
    Sphere(vec3(1, -.25, 0), .3, Material(vec3(.4, 1, .2), vec3(1), 0.05)),
    Sphere(vec3(.5, -.35, -.2), .2, Material(vec3(0, 1, .8), vec3(1), 0.05)),
    Sphere(vec3(0, -10.5, 0), 10., Material(vec3(.8, 0.2, 1), vec3(1), 0.05)),
    Sphere(vec3(-1, -.3, .2), .3, Material(vec3(.8, 0.2, .1), vec3(1), 0.05)),
    Sphere(vec3(-2, 2, 8), 8., Material(vec3(0, 0, 1), vec3(1), 1.)) // light
);

HitInfo sphereIntersection(Ray ray, Sphere sphere) {
    vec3 center = sphere.center;
    float radius = sphere.radius;

    vec3 oc = ray.origin - center;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(oc, ray.direction);
    float c = dot(oc, oc) - radius * radius;
    float discriminant = b * b - 4.0 * a * c;
    HitInfo hitInfo;
    if (discriminant > 0.0) {
        float t = (-b - sqrt(discriminant)) / (2.0 * a);
        if (t > 0.0) {
            hitInfo.isIntersecting = true;
            hitInfo.distance = t;
            hitInfo.intersection = ray.origin + t * ray.direction;
            hitInfo.normal = normalize(hitInfo.intersection - center);
            return hitInfo;
        }
    }
    hitInfo.isIntersecting = false;
    return hitInfo;
}

HitInfo intersectScene(Ray ray) {
    HitInfo hitInfo;
    hitInfo.isIntersecting = false;
    hitInfo.distance = INFINITY;
    hitInfo.material.color = vec3(0);

    for (int i = 0; i < spheres.length(); i++) {
        HitInfo sphereHitInfo = sphereIntersection(ray, spheres[i]);
        if (sphereHitInfo.isIntersecting && sphereHitInfo.distance < hitInfo.distance) {
            hitInfo = sphereHitInfo;
            hitInfo.material = spheres[i].material;
        }
    }
    return hitInfo;
}

const int BOUNCES = 10;

vec3 trace(Ray ray, float seed) {
    vec3 incomingLight = vec3(0);
    vec3 rayColor = vec3(1);

    for (int i = 0; i < BOUNCES; i++) {
        HitInfo hitInfo = intersectScene(ray);
        if (hitInfo.isIntersecting) {
            Material material = hitInfo.material;
            vec3 emittedLight = material.emissionColor * material.emissionStrength;
            incomingLight += emittedLight * rayColor; // accumulate light
            rayColor *= material.color; // accumulate color

            // change ray origin and direction for next bounce
            ray.origin = hitInfo.intersection;
            ray.direction = normalize(hitInfo.normal + uniformlyRandomDirection(seed + float(i)));
        } else {
            break;
        }

    }

    return incomingLight; 
}

out vec4 fragColor;

const int SAMPLES = 10;

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
}
`;
