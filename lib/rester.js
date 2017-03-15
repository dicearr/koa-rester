const defaultOptions = {};
/**
 * Main class
 */
class Rester {
  /**
   * @param {Object} options Rester configurations
   */
  constructor(options = {}) {
    const opt = Object.assign(options, defaultOptions);
    this.router = opt.router;
  }
  /**
   * @param {Object} persistence The persistence layer connector
   * @param {String} name The resource name, used as base url to build the API.
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The rester instance.
   */
  getList(persistence, name, options = {}) {
    const r = this.router;
    r.get(`/${name}`, async (ctx) => {
      ctx.body = [];
    });
    return this;
  }
}

module.exports = Rester;
