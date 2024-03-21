/**
 * @param { WebGL2RenderingContext } context 
 * @param { import("./Program.js").default } program 
 * @param {*} vao 
 * @param {*} uniforms 
 */
export default function render(context, program, vao, uniforms) {
  program.use();
  vao.bind();

  for (let uniform of uniforms) {
    const { location, type, size } = uniform;
    const method = `uniform${size}${type}`;
    context[method](location, ...uniform.value);
  }

  context.drawArrays(context.TRIANGLES, 0, 3);

  vao.unbind();
  context.useProgram(null);

}
