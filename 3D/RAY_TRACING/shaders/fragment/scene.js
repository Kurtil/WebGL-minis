export default `
void TestSceneTrace(in vec3 rayPos, in vec3 rayDir, inout HitInfo hitInfo)
{    
    {
        vec3 A = vec3(-15.0f, -15.0f, 22.0f);
        vec3 B = vec3( 15.0f, -15.0f, 22.0f);
        vec3 C = vec3( 15.0f,  15.0f, 22.0f);
        vec3 D = vec3(-15.0f,  15.0f, 22.0f);
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.albedo = vec3(0.7f, 0.7f, 0.7f);
            hitInfo.emissive = vec3(0.0f, 0.0f, 0.0f);
        }
    }    
     
    if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(-10.0f, 0.0f, 20.0f, 1.0f)))
    {
        hitInfo.albedo = vec3(1.0f, 0.1f, 0.1f);
        hitInfo.emissive = vec3(0.0f, 0.0f, 0.0f);        
    } 
     
    if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(0.0f, 0.0f, 20.0f, 1.0f)))
    {
        hitInfo.albedo = vec3(0.1f, 1.0f, 0.1f);
        hitInfo.emissive = vec3(0.0f, 0.0f, 0.0f);        
    }    
     
    if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(10.0f, 0.0f, 20.0f, 1.0f)))
    {
        hitInfo.albedo = vec3(0.1f, 0.1f, 1.0f);
        hitInfo.emissive = vec3(0.0f, 0.0f, 0.0f);
    }           
     
     
    if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(10.0f, 10.0f, 20.0f, 5.0f)))
    {
        hitInfo.albedo = vec3(0.0f, 0.0f, 0.0f);
        hitInfo.emissive = vec3(1.0f, 0.9f, 0.7f) * 100.0f;
    }         
}
`;