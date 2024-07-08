export default `
const int MAX_BOUNCES = 8;

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
      break;
    }

    rayOrigin += rayDirection * hitInfo.dist + hitInfo.normal * MINIMUM_HIT_DISTANCE;
    // calculate new ray direction, in a cosine weighted hemisphere oriented at normal
    rayDirection = normalize(RandomUnitVector(state) + hitInfo.normal);

    // light contribution
    pixelColor += hitInfo.emissive * colorMask;

    colorMask *= hitInfo.albedo;
  }

  return pixelColor;
}
`;
