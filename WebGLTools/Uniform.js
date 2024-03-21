export default class Uniform {
    /**
   * @param { Object } options
   * @param { string } options.name
   * @param { GLenum } options.type
   * @param { number } options.size
   * @param { number } options.location
   */
  constructor({ name, type, size, location }) {
    /** @type { string } */
    this.name = name;
    /** @type { GLenum } */
    this.type = type;
    /** @type { number } */
    this.size = size;
    /** @type { number } */
    this.location = location;
  }
}