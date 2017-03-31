const errorHandler = require('./errorHandler');
const debug = require('debug')('koa-rester::build');
const debugRequests = require('debug')('koa-rester::request');

const defaultOptions = {
  errorHandler,
};
const has = Object.prototype.hasOwnProperty;

/**
 * @module koa-rester
 */

class Rester {
  /**
   * Create a new Rester.
   * @alias module:koa-rester
   * @constructor
   * @param {Object} options - Configuration object. Property router is compulsory.
   * @param {Function} options.errorHandler -  A function that receive the DB error and returns
   * an JSON object with at least two properties status and message. Status will
   * be the HTTP response status and the whole object will be sent as body.
   * @param {Object} options.router - The koa express style router. Any router that supports
   * get, post, put, patch and delete operations.
   * @param {Object} options.model - The persistence layer model. It can be included here or
   * by using the add() function. Use add function if the rester itself is going
   * to be used to export multiple resources.
   * @param {String} options.base - The resource base url. It can be included here or by using
   * the add() function. Use add function if the rester itself is going
   * to be used to export multiple resources.
   * @param {Function} options.before - A koa middleware to be executed before each single
   * rest request. It can be added in get, post, put, delete, list and rest options.
   * @param {Function} options.after - A koa middleware to be executed after each single
   * rest request. It can be added in get, post, put, delete, list and rest options.
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
   * @param {String} name The resource name used to build the resource URI
   * @return {Rester} A new Rester instance configured with the given model and
   * base.
   */
  add(model, name) {
    const base = this.base ? `${this.base}/${name}` : `${name}`;
    debug(`Resource added with base url '${base}'`);
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
    ['list', 'post', 'get', 'patch', 'delete'].forEach((m) => {
      const specificOpts = {};
      const before = options[`before${m[0].toUpperCase()}${m.slice(1)}`];
      if (before) specificOpts.before = before;
      const after = options[`after${m[0].toUpperCase()}${m.slice(1)}`];
      if (after) specificOpts.after = after;
      this[m](Object.assign(options, specificOpts));
    });
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
    if (!this.isValid()) return false;
    debug(`GET '/${this.base}' built`);
    const r = this.router;
    if (options.before) r.get(`/${this.base}`, options.before);
    r.get(`/${this.base}`, async (ctx, next) => {
      try {
        debugRequests(`GET '/${this.base}' `);
        ctx.body = await this.listHelper();
        await next();
      } catch (e) {
        ctx.body = this.errorHandler(e);
        ctx.status = ctx.body.status;
      }
    });
    if (options.after) r.get(`/${this.base}`, options.after);
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
    if (!this.isValid()) return false;
    debug(`POST '/${this.base}' built`);
    const r = this.router;
    if (options.before) r.post(`/${this.base}`, options.before);
    r.post(`/${this.base}`, async (ctx, next) => {
      try {
        debugRequests(`POST '/${this.base}' `);
        const doc = await this.postHelper(ctx.request.body);
        ctx.status = 201;
        ctx.body = doc;
        await next();
      } catch (e) {
        ctx.body = this.errorHandler(e);
        ctx.status = ctx.body.status;
      }
    });
    if (options.after) r.post(`/${this.base}`, options.after);
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
    if (!this.isValid()) return false;
    debug(`GET '/${this.base}/:id' built`);
    const r = this.router;
    if (options.before) r.get(`/${this.base}/:id`, options.before);
    r.get(`/${this.base}/:id`, async (ctx, next) => {
      try {
        debugRequests(`GET '/${this.base}/${ctx.params.id}' `);
        const doc = await this.getHelper(ctx.params.id);
        ctx.status = 200;
        ctx.body = doc;
        await next();
      } catch (e) {
        ctx.body = this.errorHandler(e);
        ctx.status = ctx.body.status;
      }
    });
    if (options.after) r.get(`/${this.base}/:id`, options.after);
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
  /**
   * Build the endpoint /resource/:id allowing PATCH requests. It will modify the resource
   * with the id given in the url.
   * @method
   * @name patch
   * @memberof module:koa-rester.prototype
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The Rester itself.
   */
  patch(options = {}) {
    if (!this.isValid()) return false;
    debug(`PATCH '/${this.base}/:id' built`);
    const r = this.router;
    if (options.before) r.patch(`/${this.base}/:id`, options.before);
    r.patch(`/${this.base}/:id`, async (ctx, next) => {
      try {
        debugRequests(`PATCH '/${this.base}/${ctx.params.id}' `);
        const doc = await this.getHelper(ctx.params.id);
        await this.patchHelper(doc, ctx.request.body);
        ctx.status = 200;
        ctx.body = doc;
        await next();
      } catch (e) {
        ctx.body = this.errorHandler(e);
        ctx.status = ctx.body.status;
      }
    });
    if (options.after) r.patch(`/${this.base}/:id`, options.after);
    return this;
  }
  /**
   * It wraps the Model's query so to be called from an async function with await.
   * This wrapper would be useless if only mongoose models were supported.
   * @param {Object} original The document to be updated.
   * @param {Object} patch The new properties.
   * @return {Promise} Resolved with all the documents/records or rejected with
   * the error.
   */
  patchHelper(original, patch) {
    return new Promise((resolve, reject) => {
      const doc = Object.assign(original, patch);
      doc.save((err) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }
  /**
   * Build the endpoint /resource/:id allowing DELETE requests. It will remove the resource
   * with the id given in the url.
   * @method
   * @name delete
   * @memberof module:koa-rester.prototype
   * @param {Object} options The endpoint specific options.
   * @return {Rester} The Rester itself.
   */
  delete(options = {}) {
    if (!this.isValid()) return false;
    debug(`DELETE '/${this.base}/:id' built`);
    const r = this.router;
    if (options.before) r.delete(`/${this.base}/:id`, options.before);
    r.delete(`/${this.base}/:id`, async (ctx, next) => {
      try {
        debugRequests(`DELETE '/${this.base}/${ctx.params.id}' `);
        const doc = await this.getHelper(ctx.params.id);
        await this.deleteHelper(doc);
        ctx.status = 200;
        ctx.body = doc;
        await next();
      } catch (e) {
        ctx.body = this.errorHandler(e);
        ctx.status = ctx.body.status;
      }
    });
    if (options.after) r.delete(`/${this.base}/:id`, options.after);
    return this;
  }
  /**
   * It wraps the Model's query so to be called from an async function with await.
   * This wrapper would be useless if only mongoose models were supported.
   * @param {Object} doc The document to be removed.
   * @return {Promise} Resolved with all the documents/records or rejected with
   * the error.
   */
  deleteHelper(doc) {
    return new Promise((resolve, reject) => {
      doc.remove((err) => {
        if (err) reject(err);
        resolve(doc);
      });
    });
  }
  /**
   * Checks if the required options are present.
   * @return {Boolean}          True if the options are valid, otherwise false.
   */
  isValid() {
    return has.call(this, 'model') && this.model &&
      has.call(this, 'base') && this.base;
  }
}

module.exports = Rester;
