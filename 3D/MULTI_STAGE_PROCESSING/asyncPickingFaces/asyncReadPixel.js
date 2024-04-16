/**
 * @param { WebGL2RenderingContext } gl 
 */
export default function makeAsyncPixelReader(gl) {
  const readBuffer = gl.createBuffer();
  const dstBuffer = new Uint32Array(4);

  return {
    async read(x, y) {
      // read the pixel data into the read buffer asynchronously
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, readBuffer);
      gl.bufferData(gl.PIXEL_PACK_BUFFER, dstBuffer.byteLength, gl.STREAM_READ);
      gl.readBuffer(gl.COLOR_ATTACHMENT1);
      gl.readPixels(x, gl.canvas.height - y, 1, 1, gl.RGBA_INTEGER, gl.UNSIGNED_INT, 0);
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
      gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, dstBuffer, 0); // TODO not need to read the whole buffer because only the red channel is needed... ?
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

      return dstBuffer;
    }
  }


}