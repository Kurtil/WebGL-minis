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
    hitInfo.material.IOR = 1.;

    TestSceneTrace(rayOrigin, rayDirection, hitInfo);

    if (hitInfo.dist == INFINITY) {
      // skybox contribution
      pixelColor += SRGBToLinear(texture(skybox, rayDirection).rgb) * colorMask * c_skyboxBrightnessMultiplier;
      break;
    }

    rayOrigin += rayDirection * hitInfo.dist + hitInfo.normal * MINIMUM_HIT_DISTANCE;

    // apply fresnel
    float specularChance = hitInfo.material.specularPercentage;
    if (specularChance > 0.0f)
    {
        specularChance = FresnelReflectAmount(
            1.0,
            hitInfo.material.IOR,
            rayDirection, hitInfo.normal, hitInfo.material.specularPercentage, 1.0f);  
    }
          
    // calculate whether we are going to do a diffuse or specular reflection ray 
    float doSpecular = step(RandomFloat01(state), specularChance);

    // Calculate a new ray direction.
    // Diffuse uses a normal oriented cosine weighted hemisphere sample.
    // Perfectly smooth specular uses the reflection ray.
    // Rough (glossy) specular lerps from the smooth specular to the rough diffuse by the material roughness squared
    // OPTION: Squaring the roughness is just a convention to make roughness feel more linear perceptually.
    vec3 diffuseRayDir = normalize(hitInfo.normal + RandomUnitVector(state));
    vec3 specularRayDir = reflect(rayDirection, hitInfo.normal);
    specularRayDir = normalize(mix(specularRayDir, diffuseRayDir, hitInfo.material.roughness * hitInfo.material.roughness));
    rayDirection = mix(diffuseRayDir, specularRayDir, doSpecular);

    // light contribution
    pixelColor += hitInfo.material.emissive * colorMask;

    colorMask *= mix(hitInfo.material.albedo, hitInfo.material.specularColor, doSpecular);

    // Russian Roulette
    // As the throughput gets smaller, the ray is more likely to get terminated early.
    // Survivors have their value boosted to make up for fewer samples being in the average.
    {
        float p = max(colorMask.r, max(colorMask.g, colorMask.b));
        if (RandomFloat01(state) > p)
            break;
    
        // Add the energy we 'lose' by randomly terminating paths
        colorMask *= 1.0f / p;

        // get the probability for choosing the ray type we chose
        float rayProbability = (doSpecular == 1.0f) ? specularChance : 1.0f - specularChance;
                
        // avoid numerical issues causing a divide by zero, or nearly so (more important later, when we add refraction)
        rayProbability = max(rayProbability, 0.001f);

        // since we chose randomly between diffuse and specular,
        // we need to account for the times we didn't do one or the other.
        colorMask /= rayProbability;
    }
  }

  return pixelColor;
}
`;
