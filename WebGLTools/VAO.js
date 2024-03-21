export default class VAO {
  /**
   * @param { Object } options
   * @param { WebGL2RenderingContext } options.context
   */
  constructor({ context: gl }) {
    /** @type { WebGL2RenderingContext } */
    this.gl = gl;

    /** @type { WebGLVertexArrayObject } */
    this.vao = gl.createVertexArray();
  }

  bind() {
    this.gl.bindVertexArray(this.vao);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }

  /**
   * @param { import("./Buffer.js").default } buffer
   * @param { import("./Attribute.js").default } attribute
   */
  linkBufferAndAttribute(buffer, attribute) {
    if (buffer.target !== this.gl.ARRAY_BUFFER) {
      throw new Error("[VAO - bindBuffer] Buffer target must be ARRAY_BUFFER");
    }

    this.bind();
    buffer.bind();

    this.gl.enableVertexAttribArray(attribute.location);
    this.gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, false, 0, 0);

    this.unbind();
    buffer.unbind();
  }
}