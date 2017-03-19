const errorHandler = require('./errorHandler');

const defaultOptions = {
  errorHandler,
};

/**
 * @module koa-rester
 */

class Rester {
  /**
   * Create a new Rester.
   * @alias module:koa-rester
   * @constructor
   * @param {Object} options Configuration object. Property router is compulsory.
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
   * @name add
   * @method
   * @memberof module:koa-rester.prototype
   * @param {Object} model The persistence layer Model object.
   * @param {String} base Base URL from which the resource API will be built.
   * @return {Rester} A new Rester instance configured with the given model and
   * base.
   */
  add(model, base) {
    return new Rester(Object.assign(this.opt, { model, base }));
  }
  /**
   * Build the endpoints /resource and /resource/:id with the methods GET, POST
   * PUT, PATCH and DELETE.
   * @method
   * @name rest
   * @memberof module:koa-rester.prototype
   * @param {Object} options The resource specific options.
   * @return {Rester} The Rester itself.
   */
  rest(options = {}) {
    ['list', 'post', 'get'].forEach(m => this[m](options));
    return this;
  }
  /**
   * Build the endpoint /resource allowing GET requests. It will respond with
   * all the resources available in the persistence layer.
   * @method
   * @name list
   * @memberof module:koa-rester.prototype
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The Rester itself.
   */
  list(options = {}) {
    if (!this.model || !this.base) return false;
    const r = this.router;
    r.get(`/${this.base}`, async (ctx) => {
      try {
        ctx.body = await this.listHelper();
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
   * Build the endpoint /resource allowing POST requests. It will save the resource
   * received in the persistence layer.
   * @method
   * @name post
   * @memberof module:koa-rester.prototype
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The Rester itself.
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
      this.model.create(item, (err, doc) => {
        if (err) reject(err);
        if (doc) resolve(doc);
        else resolve(item);
      });
    });
  }
  /**
   * Build the endpoint /resource/:id allowing GET requests. It will return the resource
   * with the id given in the url.
   * @method
   * @name get
   * @memberof module:koa-rester.prototype
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The Rester itself.
   */
  get(options = {}) {
    if (!this.base || !this.model) return false;
    const r = this.router;
    r.get(`/${this.base}/:id`, async (ctx) => {
      try {
        const doc = await this.getHelper(ctx.params.id);
        ctx.status = 200;
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
   * @param {Object} id The id to find by.
   * @return {Promise} Resolved with all the documents/records or rejected with
   * the error.
   */
  getHelper(id) {
    return new Promise((resolve, reject) => {
      this.model.find({ _id: id }, (err, docs) => {
        if (err) reject(err);
        resolve(docs.pop());
      });
    });
  }
}

module.exports = Rester;
