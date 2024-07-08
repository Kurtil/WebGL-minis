export function normalize(vector) {
    return mul(vector, 1 / len(vector));
}

export function len([x, y, z]) {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}

export function mul([x, y, z], scalar) {
    return [x * scalar, y * scalar, z * scalar];
}

export function divide([x1, y1, z1], [x2, y2, z2]) {
    return [x1 / x2, y1 / y2, z1 / z2];
}

export function mulParts([x1, y1, z1], [x2, y2, z2]) {
    return [x1 * x2, y1 * y2, z1 * z2];
}

export function add([x1, y1, z1], [x2, y2, z2]) {
    return [x1 + x2, y1 + y2, z1 + z2];
}

export function sub([x1, y1, z1], [x2, y2, z2]) {
    return add([x1, y1, z1], mul([x2, y2, z2], -1));
}

export function dot([x1, y1, z1], [x2, y2, z2]) {
    return x1 * x2 + y1 * y2 + z1 * z2;
}

export function reflect(vector, normal) {
    return sub(vector, mul(normal, 2 * dot(vector, normal)));
}

/**
The sphereIntersection function calculates the intersection of a ray with a sphere in 3D space. It returns information about whether the ray intersects the sphere, and if so, the distance to the intersection point and the coordinates of the intersection point itself. Here's a step-by-step explanation:

1 - Extract positions and directions: The function takes three arguments:

rayOrigin: The starting point of the ray in 3D space, represented as an array of coordinates [originX, originY, originZ].
rayDirection: The direction vector of the ray, also an array of coordinates [rayX, rayY, rayZ]. This vector should be normalized (have a length of 1) for accurate calculations.
sphere: An object representing the sphere, which contains a position property (an array [sphereX, sphereY, sphereZ] representing the sphere's center) and a radius property.


2 - Calculate quadratic coefficients (a, b, c): These coefficients are part of the quadratic equation ax^2 + bx + c = 0, derived from the geometric problem of finding where (if at all) the ray intersects the sphere. The coefficients are calculated based on the ray's direction and origin, and the sphere's position and radius.

3 - Calculate the discriminant: The discriminant b^2 - 4ac determines the nature of the roots of the quadratic equation. If it's negative, the equation has no real roots, and the ray does not intersect the sphere.

4 - Check for intersection: If the discriminant is non-negative, the ray potentially intersects the sphere. The roots of the equation (calculated using the quadratic formula) represent the distances along the ray to the intersection points. There can be two points of intersection (the ray enters and exits the sphere), one (the ray is tangent to the sphere), or none (the discriminant is negative, handled earlier).

5 - Calculate the nearest intersection point: If the ray intersects the sphere, the function calculates the nearest intersection point by selecting the smaller of the two distances (t1 and t2) that are positive. This is the point where the ray first intersects the sphere.

6 - Return result: The function returns an object containing:

isIntersecting: A boolean indicating whether the ray intersects the sphere.
distance: The distance from the ray's origin to the nearest intersection point (if an intersection occurs).
intersection: The 3D coordinates of the intersection point (calculated by moving along the ray's direction from its origin by the distance of the intersection).
Auxiliary functions add and mul are used to calculate the intersection point's coordinates but are not defined within the provided code. Presumably, add performs vector addition, and mul performs scalar multiplication on a vector.
 */
/**
 * @param {[number, number, number]} rayOrigin
 * @param {[number, number, number]} rayDirection normalized
 * @param {SceneObject} sphere
 * @returns {{isIntersecting: boolean, distance: number, intersection: [number, number, number], normal: [number, number, number]}}
 */
export function sphereIntersection(rayOrigin, rayDirection, sphere) {
    const [sphereX, sphereY, sphereZ] = sphere.position;
    const [rayX, rayY, rayZ] = rayDirection;
    const [originX, originY, originZ] = rayOrigin;

    const a = rayX ** 2 + rayY ** 2 + rayZ ** 2;
    const b = 2 * (rayX * (originX - sphereX) + rayY * (originY - sphereY) + rayZ * (originZ - sphereZ));
    const c = (originX - sphereX) ** 2 + (originY - sphereY) ** 2 + (originZ - sphereZ) ** 2 - sphere.radius ** 2;

    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
        return {
            isIntersecting: false
        };
    }

    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    const distance = Math.min(t1, t2);

    if (distance < 0) {
        return {
            isIntersecting: false
        };
    }

    const intersection = add(rayOrigin, mul(rayDirection, distance));
    const normal = normalize(sub(intersection, sphere.position));

    return {
        isIntersecting: true,
        distance,
        intersection,
        normal
    };
}

// compute the near and far intersections of the cube (stored in the x and y components) using the slab method
// no intersection means vec.x > vec.y (really tNear > tFar)
export function cubeIntersection(rayOrigin, rayDirection, cubeMin, cubeMax) {
    const tMin = divide(sub(cubeMin, rayOrigin), rayDirection);
    const tMax = divide(sub(cubeMax, rayOrigin), rayDirection);
    const t1 = [Math.min(tMin[0], tMax[0]), Math.min(tMin[1], tMax[1]), Math.min(tMin[2], tMax[2])];
    const t2 = [Math.max(tMin[0], tMax[0]), Math.max(tMin[1], tMax[1]), Math.max(tMin[2], tMax[2])];
    const tNear = Math.max(t1[0], t1[1], t1[2]);
    const tFar = Math.min(t2[0], t2[1], t2[2]);
    return { tNear, tFar, isIntersecting: tNear <= tFar};
}

export function cubeNormal([x, y, z], cubeMin, cubeMax) {
    const epsilon = 0.0001;
    if (Math.abs(x - cubeMin[0]) < epsilon) return [-1, 0, 0];
    if (Math.abs(x - cubeMax[0]) < epsilon) return [1, 0, 0];
    if (Math.abs(y - cubeMin[1]) < epsilon) return [0, -1, 0];
    if (Math.abs(y - cubeMax[1]) < epsilon) return [0, 1, 0];
    if (Math.abs(z - cubeMin[2]) < epsilon) return [0, 0, -1];
    if (Math.abs(z - cubeMax[2]) < epsilon) return [0, 0, 1];
    return [0, 0, 0];
}
