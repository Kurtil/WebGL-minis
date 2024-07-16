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
    vec3 albedo;
    vec3 emissive;
    float roughness;
    float specularPercentage;
    vec3 specularColor; 
    float IOR;
};

struct HitInfo
{
    float dist;
    vec3 normal;
    Material material;
};
`;

const vertexShader = global + sRGB + randrom + fresnel + geometry + scene + getRayColor + main;

export default vertexShader;