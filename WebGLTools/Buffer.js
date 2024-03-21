export default class Buffer {
  /**
   * @param { Object } options
   * @param { WebGL2RenderingContext } options.context
   * @param { TypedArray } options.data
   * @param { number } [options.usage]
   * @param { number } [options.target]
   */
  constructor({ context: gl, data, usage = gl.STATIC_DRAW, target = gl.ARRAY_BUFFER }) {
    /** @type { WebGL2RenderingContext } */
    this.gl = gl;
    /** @type { number } */
    this.target = target;

    /** @type { WebGLBuffer } */
    this.buffer = gl.createBuffer();
    gl.bindBuffer(target, this.buffer);
    gl.bufferData(target, data, usage);

    gl.bindBuffer(target, null);
  }
  
  bind() {
    this.gl.bindBuffer(this.target, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.target, null);
  }
}