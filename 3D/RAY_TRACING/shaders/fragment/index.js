import geometry from './geometry.js';
import main from './main.js';
import getRayColor from './getRayColor.js';
import randrom from './random.js';
import scene from './scene.js';
import sRGB from './sRGB.js';

const global = `
precision highp float;

const float INFINITY = 10000.0;
const float MINIMUM_HIT_DISTANCE = 0.001;
const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;

struct HitInfo
{
    float dist;
    vec3 normal;
    vec3 albedo;
    vec3 emissive;
};
`;

const vertexShader = global + sRGB + randrom + geometry + scene + getRayColor + main;

export default vertexShader;