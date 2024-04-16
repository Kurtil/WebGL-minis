/**
 * @param { WebGL2RenderingContext } gl 
 * @returns 
 */
export default function makeAsyncPickingQueue(gl) {

  const { top, left } = gl.canvas.getBoundingClientRect(); // not changing

  let pickPositionRequest = null;

  gl.canvas.addEventListener("mousemove", (event) => {
    const x = event.clientX - left;
    const y = event.clientY - top;

    pickPositionRequest = { x, y };
  });

  const pixelBuffer = new Uint32Array(4);

  return {
    flush() {
      if (!pickPositionRequest) return;

        const { x, y } = pickPositionRequest;
        pickPositionRequest = null;

        gl.readBuffer(gl.COLOR_ATTACHMENT1);
        gl.readPixels(x, gl.canvas.height - y, 1, 1, gl.RGBA_INTEGER, gl.UNSIGNED_INT, pixelBuffer);

        console.log("Picked vertex id: ", pixelBuffer[0]);
    }
  };
}