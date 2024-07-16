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
    // shoot a ray out into the world
    HitInfo hitInfo;
    hitInfo.material = getZeroedMaterial();
    hitInfo.dist = INFINITY;
    hitInfo.fromInside = false;
    TestSceneTrace(rayOrigin, rayDirection, hitInfo);
     
    // if the ray missed, we are done
    if (hitInfo.dist == INFINITY)
    {
        pixelColor += SRGBToLinear(texture(skybox, rayDirection).rgb) * c_skyboxBrightnessMultiplier * colorMask;
        break;
    }
     
    // do absorption if we are hitting from inside the object
    if (hitInfo.fromInside)
        colorMask *= exp(-hitInfo.material.refractionColor * hitInfo.dist);
     
    // get the pre-fresnel chances
    float specularChance = hitInfo.material.specularChance;
    float refractionChance = hitInfo.material.refractionChance;
    //float diffuseChance = max(0.0f, 1.0f - (refractionChance + specularChance));
     
    // take fresnel into account for specularChance and adjust other chances.
    // specular takes priority.
    // chanceMultiplier makes sure we keep diffuse / refraction ratio the same.
    float rayProbability = 1.0f;
    if (specularChance > 0.0f)
    {
        specularChance = FresnelReflectAmount(
            hitInfo.fromInside ? hitInfo.material.IOR : 1.0,
            !hitInfo.fromInside ? hitInfo.material.IOR : 1.0,
            rayDirection, hitInfo.normal, hitInfo.material.specularChance, 1.0f);
         
        float chanceMultiplier = (1.0f - specularChance) / (1.0f - hitInfo.material.specularChance);
        refractionChance *= chanceMultiplier;
        //diffuseChance *= chanceMultiplier;
    }
     
    // calculate whether we are going to do a diffuse, specular, or refractive ray
    float doSpecular = 0.0f;
    float doRefraction = 0.0f;
    float raySelectRoll = RandomFloat01(state);
    if (specularChance > 0.0f && raySelectRoll < specularChance)
    {
        doSpecular = 1.0f;
        rayProbability = specularChance;
    }
    else if (refractionChance > 0.0f && raySelectRoll < specularChance + refractionChance)
    {
        doRefraction = 1.0f;
        rayProbability = refractionChance;
    }
    else
    {
        rayProbability = 1.0f - (specularChance + refractionChance);
    }
     
    // numerical problems can cause rayProbability to become small enough to cause a divide by zero.
    rayProbability = max(rayProbability, 0.001f);
     
    // update the ray position
    if (doRefraction == 1.0f)
    {
        rayOrigin = (rayOrigin + rayDirection * hitInfo.dist) - hitInfo.normal * MINIMUM_HIT_DISTANCE;
    }
    else
    {
        rayOrigin = (rayOrigin + rayDirection * hitInfo.dist) + hitInfo.normal * MINIMUM_HIT_DISTANCE;
    }
      
    // Calculate a new ray direction.
    // Diffuse uses a normal oriented cosine weighted hemisphere sample.
    // Perfectly smooth specular uses the reflection ray.
    // Rough (glossy) specular lerps from the smooth specular to the rough diffuse by the material roughness squared
    // Squaring the roughness is just a convention to make roughness feel more linear perceptually.
    vec3 diffuseRayDir = normalize(hitInfo.normal + RandomUnitVector(state));
     
    vec3 specularRayDir = reflect(rayDirection, hitInfo.normal);
    specularRayDir = normalize(mix(specularRayDir, diffuseRayDir, hitInfo.material.specularRoughness*hitInfo.material.specularRoughness));
 
    vec3 refractionRayDir = refract(rayDirection, hitInfo.normal, hitInfo.fromInside ? hitInfo.material.IOR : 1.0f / hitInfo.material.IOR);
    refractionRayDir = normalize(mix(refractionRayDir, normalize(-hitInfo.normal + RandomUnitVector(state)), hitInfo.material.refractionRoughness*hitInfo.material.refractionRoughness));
             
    rayDirection = mix(diffuseRayDir, specularRayDir, doSpecular);
    rayDirection = mix(rayDirection, refractionRayDir, doRefraction);
     
    // add in emissive lighting
    pixelColor += hitInfo.material.emissive * colorMask;
     
    // update the colorMultiplier. refraction doesn't alter the color until we hit the next thing, so we can do light absorption over distance.
    if (doRefraction == 0.0f)
        colorMask *= mix(hitInfo.material.albedo, hitInfo.material.specularColor, doSpecular);
     
    // since we chose randomly between diffuse, specular, refract,
    // we need to account for the times we didn't do one or the other.
    colorMask /= rayProbability;
     
    // Russian Roulette
    // As the colorMask gets smaller, the ray is more likely to get terminated early.
    // Survivors have their value boosted to make up for fewer samples being in the average.
    {
        float p = max(colorMask.r, max(colorMask.g, colorMask.b));
        if (RandomFloat01(state) > p)
            break;
 
        // Add the energy we 'lose' by randomly terminating paths
        colorMask *= 1.0f / p;            
    }
  }

  return pixelColor;
}
`;
