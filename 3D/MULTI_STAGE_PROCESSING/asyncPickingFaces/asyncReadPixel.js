/**
 * @param { WebGL2RenderingContext } gl 
 */
export default function makeAsyncPixelReader(gl) {
  const readBuffer = gl.createBuffer();
  const dstBuffer = new Uint8Array(1);

  return {
    async read(x, y) {
      // read the pixel data into the read buffer asynchronously
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, readBuffer);
      gl.bufferData(gl.PIXEL_PACK_BUFFER, dstBuffer.byteLength, gl.STREAM_READ);
      gl.readBuffer(gl.COLOR_ATTACHMENT1);

      const format = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT);
      const type = gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE);

      gl.readPixels(x, gl.canvas.height - y, 1, 1, format, type, 0);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

      // wait the fence
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();

      await new Promise((resolve, reject) => {
        function test() {
          const res = gl.clientWaitSync(sync, gl.SYNC_FLUSH_COMMANDS_BIT, 0);

          if (res === gl.WAIT_FAILED) {
            reject();
          } else if (res === gl.TIMEOUT_EXPIRED) {
            setTimeout(test, 0);
          } else {
            gl.deleteSync(sync);
            resolve();
          }
        }

        test();
      });


      // read the pixel data from the buffer
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, readBuffer);
      gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, dstBuffer);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

      return dstBuffer;
    },
    destroy() {
      gl.deleteBuffer(readBuffer);
    }
  }


}