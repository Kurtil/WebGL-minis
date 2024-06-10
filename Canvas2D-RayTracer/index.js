import { sphereIntersection, normalize, reflect, add, mulParts, mul } from './utils.js';

const FOCAL_LENGTH = 130;
const RAY_BOUNCES = 3;
const SAMPLES = 1;
const JITTERING = 0.02;
const RAY_ORIGIN = [0, 0, 0];

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const { width, height } = canvas;

const pixels = Array(width).fill().map(() => Array(height).fill().map(() => [0, 0, 0]));

/**
 * @typedef SceneObject
 * @property {'sphere'} shape
 * @property {number} radius
 * @property {[number, number, number]} position
 */

/**
 * @type {SceneObject[]}
 */
const objects = [
    {
        shape: 'sphere',
        radius: 5,
        position: [4, -8, 10],
        emissive: [255, 0, 0],
        reflectivity: [1, 1, 1],
        rougthness: .4
    },
    {
        shape: 'sphere',
        radius: 10,
        position: [15, 15, 20],
        emissive: [0, 255, 0],
        rougthness: .2
    },
    {
        shape: 'sphere',
        radius: 12,
        position: [-12, 0, 20],
        emissive: [0, 0, 255],
        reflectivity: [1, 1, 1]
    },
    {
        shape: 'sphere',
        radius: 40,
        position: [0, 0, 60],
        emissive: [226, 226, 0],
        reflectivity: [1, 1, 1]
    }
];

paint(pixels);

function paint(pixels) {
    for (let i = 0; i < pixels.length; i++) {
        for (let j = 0; j < pixels[i].length; j++) {
            const x = i - width / 2;
            const y = (pixels[i].length - j) - height / 2;

            const direction = normalize([x, y, FOCAL_LENGTH]);

            let color = [0, 0, 0];
            for (let s = 0; s < SAMPLES; s++) {
                const jitter = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
                const jitteredDirection = normalize(add(direction, mul(jitter, JITTERING)));
                const sColor = trace(RAY_ORIGIN, jitteredDirection, objects);

                color = add(color, sColor);
            }
            color = mul(color, 1 / SAMPLES);

            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(i , j, 1, 1);
        }
    }
}

function trace(origin, direction, objects, bouncesLeft = RAY_BOUNCES) {
    let closestIntersection = null;

    for (const object of objects) {
        if (object.shape === 'sphere') {
            const intersection = sphereIntersection(origin, direction, object);

            if (intersection.isIntersecting) {
                if (!closestIntersection || intersection.distance < closestIntersection.distance) {
                    const reflectivity = object.reflectivity ?? [1, 1, 1];

                    let normal = intersection.normal;
                    if (object.rougthness > 0) {
                        const randomNormal = normalize([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
                        normal = normalize(add(normal, mul(randomNormal, object.rougthness)));
                    }

                    closestIntersection = {
                        object: object,
                        color: mulParts(object.emissive, reflectivity),
                        distance: intersection.distance,
                        origin: intersection.intersection,
                        normal,
                        reflectivity
                    };
                }
            }
        }
    }

    if (closestIntersection) {
        if (bouncesLeft > 0) {
            const reflection = reflect(direction, closestIntersection.normal);
            const color = trace(closestIntersection.origin, reflection, objects, bouncesLeft - 1);

            closestIntersection.color = add(mulParts(color, closestIntersection.reflectivity), closestIntersection.color);
        }
        return closestIntersection.color;
    }

    return [0, 0, 0];
}