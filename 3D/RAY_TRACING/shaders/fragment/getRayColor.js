export default `
const int MAX_BOUNCES = 8;
uniform samplerCube skybox;

const float c_skyboxBrightnessMultiplier = 8.0;

vec3 getRayColor(vec3 startRayOrigin, vec3 startRayDirection, inout uint state) {

  vec3 pixelColor = vec3(0);
  vec3 colorMask = vec3(1);

  vec3 rayOrigin = startRayOrigin;
  vec3 rayDirection = startRayDirection;

  for (int i = 0; i < MAX_BOUNCES; i++) {
    HitInfo hitInfo;
    hitInfo.dist = INFINITY;

    TestSceneTrace(rayOrigin, rayDirection, hitInfo);

    if (hitInfo.dist == INFINITY) {
      // skybox contribution
      pixelColor += SRGBToLinear(texture(skybox, rayDirection).rgb) * colorMask * c_skyboxBrightnessMultiplier;
      break;
    }

    rayOrigin += rayDirection * hitInfo.dist + hitInfo.normal * MINIMUM_HIT_DISTANCE;

    float doSpecular = step(0.0, hitInfo.material.specularPercentage - RandomFloat01(state));

    // Calculate a new ray direction.
    // Diffuse uses a normal oriented cosine weighted hemisphere sample.
    // Perfectly smooth specular uses the reflection ray.
    // Rough (glossy) specular lerps from the smooth specular to the rough diffuse by the material roughness squared
    // OPTION: Squaring the roughness is just a convention to make roughness feel more linear perceptually.
    vec3 diffuseRayDir = normalize(hitInfo.normal + RandomUnitVector(state));
    vec3 specularRayDir = reflect(rayDirection, hitInfo.normal);
    specularRayDir = normalize(mix(specularRayDir, diffuseRayDir, hitInfo.material.roughness));
    rayDirection = mix(diffuseRayDir, specularRayDir, doSpecular);

    // light contribution
    pixelColor += hitInfo.material.emissive * colorMask;

    colorMask *= mix(hitInfo.material.albedo, hitInfo.material.specularColor, doSpecular);
  }

  return pixelColor;
}
`;
