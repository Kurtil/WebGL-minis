export default class Renderer {
  /**
   * @param { Object } options
   * @param { WebGL2RenderingContext } options.context
   */
  constructor({ context: gl }) {
    /** @type { WebGL2RenderingContext } */
    this.gl = gl;
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  /**
   * @param { Object } options
   * @param { import("./Program.js").default } options.program
   * @param { import("./VAO.js").default } options.vao
   * @param { { [uniformName: string]: number[] } } options.uniforms
   * @param { number } [options.count=0]
   * @param { number } [options.offset=0]
   * @param { boolean } [options.inctanceCount=0]
   * @param { boolean } [options.indexed=false]
   * @param { number } [options.indexType=this.gl.UNSIGNED_SHORT]
   * @param { number } [options.primitive=this.gl.TRIANGLES]
   */
  render({ program, vao, uniforms = {}, count = 0, offset = 0, inctanceCount = 0, indexed = false, indexType = this.gl.UNSIGNED_SHORT, primitive = this.gl.TRIANGLES }) {
    program.use();
    vao.bind();

    [...Object.values(program.uniforms)].forEach(uniform => {
      const value = uniforms[uniform.name];
      if (value === undefined) return;

      const { location, type, size } = uniform;
      const method = `uniform${size}${type}`;
      this.gl[method](location, ...value);
    });

    if (inctanceCount) {
      if (indexed) {
        this.gl.drawElementsInstanced(primitive, count, indexType, offset, inctanceCount);
      } else {
        this.gl.drawArraysInstanced(primitive, offset, count, inctanceCount);
      }
    } else {
      if (indexed) {
        this.gl.drawElements(primitive, count, indexType, offset);
      } else {
        this.gl.drawArrays(primitive, offset, count);
      }
    }

    vao.unbind();
    this.gl.useProgram(null);
  }
}