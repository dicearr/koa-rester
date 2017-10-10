const compose = require('koa-compose')

const getMiddelware = (options, position) => {
  if (options && options[position]) {
    if (typeof options[position] === 'function') return [options[position]]
    return options[position]
  }
  return []
}

const concat = (options, fn) => {
  if (!options) {
    fn.total = 1
    return fn
  }
  const all = getMiddelware(options, 'before')
    .concat(fn, getMiddelware(options, 'after'))
  const f = compose(all)
  f.total = all.length
  return f
}

class Resource {
  /**
   * Should not be used directly. Build Resource through [Rester.add]{@link Rester#add}.
   *
   * @param  {Object} options Configuration options
   * @return {Resource}
   */
  constructor (options) {
    Object.assign(this, options)
  }
  /**
   * Create the GET /resource endpoint in the Resource router.
   *
   * @param  {Object} options
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before the list method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after the list method.
   * @return {Resource}
   */
  list (options) {
    const middleware = concat(options, async (ctx, next) => {
      try {
        ctx.body = { data: await this.model.list() }
        ctx.body.link = `/${this.path}`
        return next()
      } catch (e) {
        this.handleError(ctx, e, '/')
      }
    })
    this.router.get(`/${this.path}`, middleware)
    if (this.logger) {
      this
        .logger
        .log(`GET /${this.path} exposed with ${middleware.total} middlewares`)
    }
    return this
  }
  /**
   * Create the GET /resource/:id endpoint in the Resource router.
   *
   * @param  {Object} options
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before the list method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after the list method.
   * @return {Resource}
   */
  get (options) {
    const middleware = concat(options, async (ctx, next) => {
      try {
        const data = await this.model.list(ctx.params.id)
        ctx.body = { data }
        ctx.body.link = `/${this.path}`
        return next()
      } catch (e) {
        this.handleError(ctx, e, `/${this.path}`)
      }
    })
    this.router.get(`/${this.path}/:id`, middleware)
    if (this.logger) {
      this
        .logger
        .log(`GET /${this.path}/:id exposed with ${middleware.total} middlewares`)
    }
    return this
  }
  /**
   * Create the POST /resource endpoint in the Resource router.
   *
   * @param  {Object} options
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before the create method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after the create method.
   * @return {Resource}
   */
  post (options) {
    const middleware = concat(options, async (ctx, next) => {
      try {
        const id = await this.model.create(ctx.request.body)
        ctx.body = { link: `/${this.path}/${id}` }
        ctx.status = 201
        return next()
      } catch (e) {
        this.handleError(ctx, e, '/')
      }
    })
    this.router.post(`/${this.path}`, middleware)
    if (this.logger) {
      this
        .logger
        .log(`POST /${this.path}/:id exposed with ${middleware.total} middlewares`)
    }
    return this
  }
  /**
   * Create the PATCH /resource/:id endpoint in the Resource router.
   *
   * @param  {Object} options
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before the update method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after the update method.
   * @return {Resource}
   */
  patch (options) {
    const middleware = concat(options, async (ctx, next) => {
      try {
        const data = await this.model.update(ctx.params.id, ctx.request.body)
        ctx.body = { data, link: `/${this.path}` }
        return next()
      } catch (e) {
        this.handleError(ctx, e, '/')
      }
    })
    this.router.patch(`/${this.path}/:id`, middleware)
    if (this.logger) {
      this
        .logger
        .log(`PATCH /${this.path}/:id exposed with ${middleware.total} middlewares`)
    }
    return this
  }
  /**
   * Create the PUT /resource/:id endpoint in the Resource router.
   *
   * @param  {Object} options
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before the replace method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after the replace method.
   * @return {Resource}
   */
  put (options) {
    const middleware = concat(options, async (ctx, next) => {
      try {
        const data = await this.model.replace(ctx.params.id, ctx.request.body)
        ctx.body = { data, link: `/${this.path}` }
        return next()
      } catch (e) {
        this.handleError(ctx, e, '/')
      }
    })
    this.router.put(`/${this.path}/:id`, middleware)
    if (this.logger) {
      this
        .logger
        .log(`PUT /${this.path}/:id exposed with ${middleware.total} middlewares`)
    }
    return this
  }
  /**
   * Create the DELETE /resource/:id endpoint in the Resource router.
   *
   * @param  {Object} options
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before the delete method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after the delete method.
   * @return {Resource}
   */
  delete (options) {
    const middleware = concat(options, async (ctx, next) => {
      try {
        const data = await this.model.delete(ctx.params.id)
        ctx.body = { data, link: `/${this.path}` }
        return next()
      } catch (e) {
        this.handleError(ctx, e, '/')
      }
    })
    this.router.delete(`/${this.path}/:id`, middleware)
    if (this.logger) {
      this
        .logger
        .log(`DELETE /${this.path}/:id exposed with ${middleware.total} middlewares`)
    }
    return this
  }
  use (fn) {
    this.router.use(`/${this.path}`, compose(fn))
    return this
  }
  /**
   * Create all the endpoints
   *
   * @param  {Object} options The configuration for all the endpoints
   * @param  {Function} options.before The middleware or array of middlewares
   * that will be executed before any method.
   * @param  {Function} options.after The middleware or array of middlewares
   * that will be executed after all the methods.
   * @param  {Function} options.afterList options.after for list()
   * @param  {Function} options.beforeList options.before for list()
   * @param  {Function} options.afterGet options.after for get()
   * @param  {Function} options.beforeGet options.before for get()
   * @param  {Function} options.afterPost options.after for post()
   * @param  {Function} options.beforePost options.before for post()
   * @param  {Function} options.afterPut  options.after for put()
   * @param  {Function} options.beforePut options.before for put()
   * @param  {Function} options.afterDelete options.after for delete()
   * @param  {Function} options.beforeDelete options.before for delete()
   * @param  {Function} options.afterPatch options.after for patch()
   * @param  {Function} options.beforePatch options.before for patch()
   * @return {Resource}
   */
  rest (options) {
    const cap = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`
    const extract = (method, options) => {
      if (!options) return {}
      return {
        before: options[`before${cap(method)}`],
        after: options[`after${cap(method)}`]
      }
    }
    const before = getMiddelware(options, 'before')
    if (before.length) this.use(before)
    this
      .list(extract('list', options))
      .get(extract('get', options))
      .post(extract('post', options))
      .put(extract('put', options))
      .patch(extract('patch', options))
      .delete(extract('delete', options))
    const after = getMiddelware(options, 'after')
    if (after.length) this.use(after)
    return this
  }
  handleError (ctx, e, link) {
    ctx.expose = !!this.expose
    if (e.status) {
      e.data.link = link
      ctx.throw(e.status, e.message, e.data)
    }
    ctx.throw(500, { link: '/' })
  }
  /**
   * Sugar syntax that returns resource.router.routes()
   * @return {Function}
   */
  routes () {
    return this.router.routes()
  }
  /**
   * Sugar syntax that returns resource.router.allowedMethods()
   * @return {Function}
   */
  allowedMethods () {
    return this.router.allowedMethods()
  }
}

module.exports = Resource
