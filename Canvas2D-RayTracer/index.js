import { sphereIntersection, normalize, reflect, add, mulParts } from './utils.js';

const FOCAL_LENGTH = 130;
const RAY_BOUNCES = 5;
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
        reflectivity: [1, 1, 1]
    },
    {
        shape: 'sphere',
        radius: 10,
        position: [15, 15, 20],
        emissive: [0, 255, 0],
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
            const color = trace(RAY_ORIGIN, direction, objects);

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

                    closestIntersection = {
                        object: object,
                        color: mulParts(object.emissive, reflectivity),
                        distance: intersection.distance,
                        origin: intersection.intersection,
                        normal: intersection.normal,
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