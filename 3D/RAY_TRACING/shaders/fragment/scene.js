export default `
void TestSceneTrace(in vec3 rayPos, in vec3 rayDir, inout HitInfo hitInfo)
{    
    // to move the scene around, since we can't move the camera yet
    vec3 sceneTranslation = vec3(0.0f, 0.0f, 0.0f);
    vec4 sceneTranslation4 = vec4(sceneTranslation, 0.0f);
    
   	// back wall
    {
        vec3 A = vec3(-12.6f, -12.6f, 25.0f) + sceneTranslation;
        vec3 B = vec3( 12.6f, -12.6f, 25.0f) + sceneTranslation;
        vec3 C = vec3( 12.6f,  12.6f, 25.0f) + sceneTranslation;
        vec3 D = vec3(-12.6f,  12.6f, 25.0f) + sceneTranslation;
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.material.albedo = vec3(0.7f, 0.7f, 0.7f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);
            hitInfo.material.specularChance = 0.0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.0f, 0.0f, 0.0f);
        }
	}
    
    // floor
    {
        vec3 A = vec3(-12.6f, -12.45f, 25.0f) + sceneTranslation;
        vec3 B = vec3( 12.6f, -12.45f, 25.0f) + sceneTranslation;
        vec3 C = vec3( 12.6f, -12.45f, 15.0f) + sceneTranslation;
        vec3 D = vec3(-12.6f, -12.45f, 15.0f) + sceneTranslation;
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.material.albedo = vec3(0.7f, 0.7f, 0.7f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);
            hitInfo.material.specularChance = 0.0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.0f, 0.0f, 0.0f);            
        }        
    }
    
    // cieling
    {
        vec3 A = vec3(-12.6f, 12.5f, 25.0f) + sceneTranslation;
        vec3 B = vec3( 12.6f, 12.5f, 25.0f) + sceneTranslation;
        vec3 C = vec3( 12.6f, 12.5f, 15.0f) + sceneTranslation;
        vec3 D = vec3(-12.6f, 12.5f, 15.0f) + sceneTranslation;
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.material.albedo = vec3(0.7f, 0.7f, 0.7f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);
            hitInfo.material.specularChance = 0.0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.0f, 0.0f, 0.0f);
        }        
    }    
    
    // left wall
    {
        vec3 A = vec3(-12.5f, -12.6f, 25.0f) + sceneTranslation;
        vec3 B = vec3(-12.5f, -12.6f, 15.0f) + sceneTranslation;
        vec3 C = vec3(-12.5f,  12.6f, 15.0f) + sceneTranslation;
        vec3 D = vec3(-12.5f,  12.6f, 25.0f) + sceneTranslation;
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.material.albedo = vec3(0.7f, 0.1f, 0.1f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);
            hitInfo.material.specularChance = 0.0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.0f, 0.0f, 0.0f);
        }        
    }
    
    // right wall 
    {
        vec3 A = vec3( 12.5f, -12.6f, 25.0f) + sceneTranslation;
        vec3 B = vec3( 12.5f, -12.6f, 15.0f) + sceneTranslation;
        vec3 C = vec3( 12.5f,  12.6f, 15.0f) + sceneTranslation;
        vec3 D = vec3( 12.5f,  12.6f, 25.0f) + sceneTranslation;
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.material.albedo = vec3(0.1f, 0.7f, 0.1f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);
            hitInfo.material.specularChance = 0.0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.0f, 0.0f, 0.0f);            
        }        
    }    
    
    // light
    {
        vec3 A = vec3(-5.0f, 12.4f,  22.5f) + sceneTranslation;
        vec3 B = vec3( 5.0f, 12.4f,  22.5f) + sceneTranslation;
        vec3 C = vec3( 5.0f, 12.4f,  17.5f) + sceneTranslation;
        vec3 D = vec3(-5.0f, 12.4f,  17.5f) + sceneTranslation;
        if (TestQuadTrace(rayPos, rayDir, hitInfo, A, B, C, D))
        {
            hitInfo.material.albedo = vec3(0.0f, 0.0f, 0.0f);
            hitInfo.material.emissive = vec3(1.0f, 0.9f, 0.7f) * 20.0f;
            hitInfo.material.specularChance = 0.0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.0f, 0.0f, 0.0f);            
        }        
    }
    
	if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(-9.0f, -9.5f, 20.0f, 3.0f)+sceneTranslation4))
    {
        hitInfo.material.albedo = vec3(0.9f, 0.9f, 0.5f);
        hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);        
        hitInfo.material.specularChance = 0.1f;
        hitInfo.material.specularRoughness= 0.2f;
        hitInfo.material.specularColor = vec3(0.9f, 0.9f, 0.9f);        
    } 
    
	if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(-5.0f, -9.5f, 15.0f, 3.0f)+sceneTranslation4))
    {
        hitInfo.material.albedo = vec3(0.9f, 0.5f, 0.9f);
        hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);   
        hitInfo.material.specularChance = 0.1f;
        hitInfo.material.specularRoughness= 0.2;
        hitInfo.material.specularColor = vec3(0.9f, 0.9f, 0.9f);      
        hitInfo.material.refractionChance = 1.f;
        hitInfo.material.refractionRoughness = .0f;
        hitInfo.material.IOR = 1.2f;
    }

	if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(5.0f, -9.5f, 15.0f, 3.0f)+sceneTranslation4))
    {
        hitInfo.material.albedo = vec3(0.9f, 0.5f, 0.9f);
        hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);   
        hitInfo.material.specularChance = 0.1f;
        hitInfo.material.specularRoughness= 0.2;
        hitInfo.material.specularColor = vec3(0.9f, 0.9f, 0.9f);      
        hitInfo.material.refractionChance = .9f;
        hitInfo.material.refractionRoughness = .0f;
        hitInfo.material.refractionColor = vec3(1, 1, 0);
        hitInfo.material.IOR = 1.3f;
    }

    if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(0.0f, -9.5f, 20.0f, 3.0f)+sceneTranslation4))
    {
        hitInfo.material.albedo = vec3(0.9f, 0.5f, 0.9f);
        hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);   
        hitInfo.material.specularChance = 0.3f;
        hitInfo.material.specularRoughness = 0.2;
        hitInfo.material.specularColor = vec3(0.9f, 0.9f, 0.9f);        
    } 
    
    // a ball which has blue diffuse but red specular. an example of a "bad material".
    // a better lighting model wouldn't let you do this sort of thing
	if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(9.0f, -9.5f, 20.0f, 3.0f)+sceneTranslation4))
    {
        hitInfo.material.albedo = vec3(0.0f, 0.0f, 1.0f);
        hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);
        hitInfo.material.specularChance = 0.5f;
        hitInfo.material.specularRoughness= 0.4f;
        hitInfo.material.specularColor = vec3(1.0f, 0.0f, 0.0f);      
        hitInfo.material.refractionChance = 1.f;  
    }
    
    // shiny green balls of varying roughnesses
    {
        if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(-10.0f, 0.0f, 23.0f, 1.75f)+sceneTranslation4))
        {
            hitInfo.material.albedo = vec3(1.0f, 1.0f, 1.0f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);        
            hitInfo.material.specularChance = .0f;
            hitInfo.material.specularRoughness= 0.0f;
            hitInfo.material.specularColor = vec3(0.3f, 1.0f, 0.3f);   
            hitInfo.material.refractionChance = .9f;
            hitInfo.material.refractionRoughness = .5f;  
        }     
        
        if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(-5.0f, 0.0f, 23.0f, 1.75f)+sceneTranslation4))
        {
            hitInfo.material.albedo = vec3(1.0f, 1.0f, 1.0f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);        
            hitInfo.material.specularChance = 1.0f;
            hitInfo.material.specularRoughness= 0.25f;
            hitInfo.material.specularColor = vec3(0.3f, 1.0f, 0.3f);
        }            
        
        if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(0.0f, 0.0f, 23.0f, 1.75f)+sceneTranslation4))
        {
            hitInfo.material.albedo = vec3(1.0f, 1.0f, 1.0f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);        
            hitInfo.material.specularChance = 1.0f;
            hitInfo.material.specularRoughness= 0.5f;
            hitInfo.material.specularColor = vec3(0.3f, 1.0f, 0.3f);
        }            
        
        if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(5.0f, 0.0f, 23.0f, 1.75f)+sceneTranslation4))
        {
            hitInfo.material.albedo = vec3(1.0f, 1.0f, 1.0f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);        
            hitInfo.material.specularChance = 1.0f;
            hitInfo.material.specularRoughness= 0.75f;
            hitInfo.material.specularColor = vec3(0.3f, 1.0f, 0.3f);
        }        
        
        if (TestSphereTrace(rayPos, rayDir, hitInfo, vec4(10.0f, 0.0f, 23.0f, 1.75f)+sceneTranslation4))
        {
            hitInfo.material.albedo = vec3(1.0f, 1.0f, 1.0f);
            hitInfo.material.emissive = vec3(0.0f, 0.0f, 0.0f);        
            hitInfo.material.specularChance = 1.0f;
            hitInfo.material.specularRoughness= 1.0f;
            hitInfo.material.specularColor = vec3(0.3f, 1.0f, 0.3f);
        }           
    }
}
`;