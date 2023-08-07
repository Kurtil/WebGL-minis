/**
 * Create a identity 3x3 matrice.
 * @returns { Float32Array }
 */
function create() {
    return new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ])
}

/**
 * @param { Float32Array } mat3 
 * @param { Float32Array } vec3 
 * @returns { Float32Array } vec3
 */
function mulVec3(mat3, vec3) {
    const [x, y, z] = vec3;

    const [
        m1, m2, m3,
        m4, m5, m6,
        m7, m8, m9,
    ] = mat3;

    return new Float32Array([
        m1 * x + m4 * y + m7 * z,
        m2 * x + m5 * y + m8 * z,
        m3 * x + m6 * y + m9 * z,
    ])

}

/**
 * 
 * @param { Float32Array } matA 
 * @param { Float32Array } matB 
 * @returns { Float32Array }
 */
function multiply(matA, matB) {
    return new Float32Array([
        ...mulVec3(matB, matA.slice(0, 3)),
        ...mulVec3(matB, matA.slice(3, 6)),
        ...mulVec3(matB, matA.slice(6, 9)),
    ])
}

/**
* @returns { Float32Array }
*/
function translation(tx = 0, ty = 0) {
    return new Float32Array([
        1 , 0 , 0,
        0 , 1 , 0,
        tx, ty, 1,
    ])
}

/**
* @returns { Float32Array }
*/
function rotation(radiansAngle = 0) {
    const c = Math.cos(radiansAngle);
    const s = Math.sin(radiansAngle);

    return new Float32Array([
        c, -s,  0,
        s,  c,  0,
        0,  0,  1,
    ]);
}

/**
* @returns { Float32Array }
*/
function scale(sx = 1, sy = 1) {
    return new Float32Array([
        sx, 0 , 0,
        0 , sy, 0,
        0 , 0 , 1,
    ]);
}

export {
    create,
    mulVec3,
    multiply,
    translation,
    rotation,
    scale,
};
