/**
 * @param { WebGL2RenderingContext } gl 
 */
export default function makeCheckerTexture(gl) {
  const checkerTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, checkerTexture);

  const textureData = new Uint8Array([
    0xDD, 0x99, 0xDD, 0xAA,
    0x88, 0xCC, 0x88, 0xDD,
    0xCC, 0x88, 0xCC, 0xAA,
    0x88, 0xCC, 0x88, 0xCC,
  ]);

  gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R8, 4, 4);
  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,
    0,
    0,
    4,
    4,
    gl.RED,
    gl.UNSIGNED_BYTE,
    textureData,
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return checkerTexture;
}