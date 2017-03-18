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
    this.opt = opt;
    this.router = opt.router;
    if (typeof this.router === 'undefined') throw new Error('Undefined router');
    this.model = opt.model;
    this.base = opt.base;
  }
  /**
   * @param {Object} model The persistence layer model
   * @param {String} base The base url to build the API.
   * @return {Rester} The rester instance.
   */
  add(model, base) {
    return new Rester(Object.assign(this.opt, { model, base }));
  }
  /**
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The specific endpoint rester
   */
  getList(options = {}) {
    if (!this.model || !this.base) return false;
    const r = this.router;
    r.get(`/${this.base}`, async (ctx) => {
      try {
        ctx.body = await this.getListHelper();
      } catch (e) {
        ctx.status = 500;
        ctx.body = {
          status: 500,
          message: 'Internal error',
        };
      }
    });
    return this;
  }
  /**
   * @return {Promise} Resolved with all the documents/records or rejected with
   * the error.
   */
  getListHelper() {
    return new Promise((resolve, reject) => {
      this.model.find({}, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }
}

module.exports = Rester;
