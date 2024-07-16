export default `
float FresnelReflectAmount(float n1, float n2, vec3 normal, vec3 incident, float f0, float f90)
{
  // Schlick aproximation
  float r0 = (n1-n2) / (n1+n2);
  r0 *= r0;
  float cosX = -dot(normal, incident);
  if (n1 > n2)
  {
    float n = n1/n2;
    float sinT2 = n*n*(1.0-cosX*cosX);
    // Total internal reflection
    if (sinT2 > 1.0)
        return f90;
    cosX = sqrt(1.0-sinT2);
  }
  float x = 1.0-cosX;
  float ret = r0+(1.0-r0)*x*x*x*x*x;

  // adjust reflect multiplier for object reflectivity
  return mix(f0, f90, ret);
}
`;