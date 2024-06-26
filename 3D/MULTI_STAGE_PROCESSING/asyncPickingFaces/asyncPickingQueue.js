import makeAsyncPixelReader from "./asyncReadPixel.js";

/**
 * @param { WebGL2RenderingContext } gl 
 * @returns 
 */
export default function makeAsyncPickingQueue(gl) {

  let pickPositionRequest = null;

  gl.canvas.addEventListener("mousemove", (event) => {
    const { top, left } = gl.canvas.getBoundingClientRect();

    const x = event.clientX - left;
    const y = event.clientY - top;

    pickPositionRequest = { x, y };
  });

  const pixelReader = makeAsyncPixelReader(gl);

  return {
    async flush() {
      if (!pickPositionRequest) return;

      const { x, y } = pickPositionRequest;
      pickPositionRequest = null;

      const pixelData = await pixelReader.read(x, y);

      return pixelData[0];
    }
  };
}