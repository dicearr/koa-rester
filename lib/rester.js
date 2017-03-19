const errorHandler = require('./errorHandler');

const defaultOptions = {
  errorHandler,
};
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
    this.errorHandler = opt.errorHandler;
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
  list(options = {}) {
    if (!this.model || !this.base) return false;
    const r = this.router;
    r.get(`/${this.base}`, async (ctx) => {
      try {
        ctx.body = await this.listHelper();
      } catch (e) {
        ctx.body = this.errorHandler();
        ctx.status = ctx.body.status;
      }
    });
    return this;
  }
  /**
   * It wraps the Model's query so to be called from an async function with await.
   * This wrapper would be useless if only mongoose models were supported.
   * @return {Promise} Resolved with all the documents/records or rejected with
   * the error.
   */
  listHelper() {
    return new Promise((resolve, reject) => {
      this.model.find({}, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }
  /**
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The specific endpoint rester
   */
  post(options = {}) {
    if (!this.base || !this.model) return false;
    const r = this.router;
    r.post(`/${this.base}`, async (ctx) => {
      try {
        const doc = await this.postHelper(ctx.request.body);
        ctx.status = 201;
        ctx.body = doc;
      } catch (e) {
        ctx.body = this.errorHandler(e);
        ctx.status = ctx.body.status;
      }
    });
    return this;
  }
  /**
   * It wraps the Model's query so to be called from an async function with await.
   * This wrapper would be useless if only mongoose models were supported.
   * @param {Object} item The item to add into the collection
   * @return {Promise} Resolved with all the documents/records or rejected with
   * the error.
   */
  postHelper(item) {
    return new Promise((resolve, reject) => {
      this.model.create(item, (err) => {
        if (err) reject(err);
        resolve(item);
      });
    });
  }
}

module.exports = Rester;
