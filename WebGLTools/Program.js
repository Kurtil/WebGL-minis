import Attribute from "./Attribute.js";
import Uniform from "./Uniform.js";

export default class Program {
  /**
   * @param { Object } options
   * @param { WebGL2RenderingContext } options.context
   * @param { string } options.vertexShaderSource
   * @param { string } options.fragmentShaderSource
   * @param { string[] } [options.transformFeedbackVaryings = []]
   * @param { GLenum } [options.transformFeedbackVaryingsBufferMode]
   */
  constructor({ context: gl, vertexShaderSource, fragmentShaderSource, transformFeedbackVaryings = [], transformFeedbackVaryingsBufferMode = context.SEPARATE_ATTRIBS }) {
    /** @type { WebGL2RenderingContext } */
    this.gl = gl;

    if (typeof vertexShaderSource !== "string" || typeof fragmentShaderSource !== "string") {
      throw new Error("Both vertexShaderSource and fragmentShaderSource must be strings");
    }

    if (!vertexShaderSource.startsWith("#version 300 es")) {
      vertexShaderSource = `#version 300 es\n\n${vertexShaderSource}`;
    }

    if (!fragmentShaderSource.startsWith("#version 300 es")) {
      fragmentShaderSource = `#version 300 es\n\n${fragmentShaderSource}`;
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(fragmentShader));
    }

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    if (transformFeedbackVaryings.length) {
      gl.transformFeedbackVaryings(program, transformFeedbackVaryings, transformFeedbackVaryingsBufferMode);
    }

    this.transformFeedbackVaryings = transformFeedbackVaryings;
    this.transformFeedbackVaryingsBufferMode = transformFeedbackVaryingsBufferMode;

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    this.program = program;

    /** @type { { [attributeName: string]: Attribute; } } */
    this.attributes = {};

    const activeAttributes = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < activeAttributes; ++i) {
      const { name, type, size } = gl.getActiveAttrib(this.program, i);
      const location = gl.getAttribLocation(this.program, name);

      this.attributes[name] = new Attribute({ name, type, size, location });
    }

    /** @type { { [uniformName: string]: Uniform; } } */
    this.uniforms = {};
    const activeUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < activeUniforms; ++i) {
      const { name, type, size } = gl.getActiveUniform(this.program, i);
      const location = gl.getUniformLocation(this.program, name);

      this.uniforms[name] = new Uniform({ name, type, size, location });
    }
  }

  use() {
    this.gl.useProgram(this.program);
  }
}