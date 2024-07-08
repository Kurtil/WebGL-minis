import { sphereIntersection, cubeIntersection, cubeNormal, normalize, reflect, add, mulParts, mul } from './utils.js';

const FOCAL_LENGTH = 250;
const RAY_BOUNCES = 1;
const SAMPLES = 1;
const JITTERING = 0;
const RAY_ORIGIN = [0, 0, 0];
const ROOM_SIZE = 10;
const LIGHT_POSITION = [0, 0, 5];
const EPSILON = 0.0001;

// computed
const ROOM_CUBE_MIN = [-ROOM_SIZE / 2, -ROOM_SIZE / 2, -ROOM_SIZE / 2];
const ROOM_CUBE_MAX = [ROOM_SIZE / 2, ROOM_SIZE / 2, ROOM_SIZE / 2];

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
    // light
    {
        shape: 'sphere',
        radius: 1,
        position: [-5, 0, 5],
        emissive: [255, 255, 255],
        rougthness: .2,
        reflectivity: [1, 1, 1]
    },
    {
        shape: 'sphere',
        radius: 1,
        position: [2, 0, 5.8],
        emissive: [255, 255, 255],
        rougthness: .2,
        reflectivity: [1, 1, 1]
    },
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

                    // let normal = intersection.normal;
                    // if (object.rougthness > 0) {
                    //     const randomNormal = normalize([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
                    //     normal = normalize(add(normal, mul(randomNormal, object.rougthness)));
                    // }

                    closestIntersection = {
                        object,
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

    // ROOM
    const tRoom = cubeIntersection(origin, direction, ROOM_CUBE_MIN, ROOM_CUBE_MAX);

    if (tRoom.isIntersecting && (!closestIntersection || tRoom.tFar < closestIntersection.distance)) {
        const newOrigin = add(origin, mul(direction, tRoom.tFar));
        let color = [100, 100, 100];

        if (newOrigin[0] < ROOM_CUBE_MIN[0] + EPSILON) {
            color = [255, 0, 0];
        } else if (newOrigin[0] > ROOM_CUBE_MAX[0] - EPSILON) {
            color = [0, 255, 0];
        } else if (newOrigin[1] < ROOM_CUBE_MIN[1] + EPSILON) {
            color = [0, 0, 255];
        } else if (newOrigin[1] > ROOM_CUBE_MAX[1] - EPSILON) {
            color = [255, 255, 0];
        }

        closestIntersection = {
            object: null,
            // cornell box ROOM_SIZE based
            color,
            distance: tRoom.tFar,
            origin: newOrigin,
            normal: cubeNormal(newOrigin, ROOM_CUBE_MIN, ROOM_CUBE_MAX),
            reflectivity: [1, 1, 1]
        };
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