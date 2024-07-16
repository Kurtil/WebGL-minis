import geometry from './geometry.js';
import main from './main.js';
import getRayColor from './getRayColor.js';
import randrom from './random.js';
import scene from './scene.js';
import sRGB from './sRGB.js';
import fresnel from "./fresnel.js";

const global = `
precision highp float;

const float INFINITY = 10000.0;
const float MINIMUM_HIT_DISTANCE = 0.001;
const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;

struct Material {
    // Note: diffuse chance is 1.0f - (specularChance+refractionChance)
    vec3  albedo;              // the color used for diffuse lighting
    vec3  emissive;            // how much the surface glows
    float specularChance;      // percentage chance of doing a specular reflection
    float specularRoughness;   // how rough the specular reflections are
    vec3  specularColor;       // the color tint of specular reflections
    float IOR;                 // index of refraction. used by fresnel and refraction.
    float refractionChance;    // percent chance of doing a refractive transmission
    float refractionRoughness; // how rough the refractive transmissions are
    vec3  refractionColor;     // absorption for beer's law   
};

Material getZeroedMaterial()
{
    Material materiel;

    materiel.albedo = vec3(0.0f, 0.0f, 0.0f);
    materiel.emissive = vec3(0.0f, 0.0f, 0.0f);
    materiel.specularChance = 0.0f;
    materiel.specularRoughness = 0.0f;
    materiel.specularColor = vec3(0.0f, 0.0f, 0.0f);
    materiel.IOR = 1.0f;
    materiel.refractionChance = 0.0f;
    materiel.refractionRoughness = 0.0f;
    materiel.refractionColor = vec3(0.0f, 0.0f, 0.0f);

    return materiel;
}

struct HitInfo
{
    bool fromInside; // Refraction made it so we can go inside of objects, and we need to know when that happens.
    float dist;
    vec3 normal;
    Material material;
};
`;

const vertexShader = global + sRGB + randrom + fresnel + geometry + scene + getRayColor + main;

export default vertexShader;