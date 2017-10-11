const Resource = require('./resource')

const swaggerSkeleton = require('./swagger')

const defaults = {
  router: require('koa-router'),
  routerOptions: {}
}

class Rester {
  /**
   * Create a rester.
   * @param {Object} options - Configuration object.
   * @param {Router} options.router - The router to be used, by default koa-router, change
   * this property can break the package.
   * @param {Object} options.routerOptions - The options that will be passed to
   * [koa-router](https://github.com/alexmingoia/koa-router#new_module_koa-router--Router_new) constructor.
   * If options.router is overwritten with any other router this options must be
   * changed according to the new router.
   * @param {Function} options.logger - The logger that will be used
   * @param {KoaResterPersistence} options.persistence - An instance of KoaResterPersistence, such as
   * [kr-presistence-sequelize](https://github.com/dicearr/kr-presistence-sequelize),
   * [kr-persistence-inmemory](https://github.com/dicearr/kr-persistence-inmemory) or
   * [kr-presistence-mongoose](https://github.com/dicearr/kr-presistence-mongoose).
   * This property is compulsory, an error will be thrown if it is not present.
   */
  constructor (options) {
    const _options = { ...defaults, ...options }
    if (_options.persistence === undefined) {
      throw new Error('cannot persist data withou persitence layer')
    }
    this.persistence = _options.persistence
    this.router = _options.router
    this.opts = _options.routerOptions
    this.logger = _options.logger
    this.docs = swaggerSkeleton.metadata()
    if (this.opts.prefix) {
      this.docs.basePath = this.opts.prefix
    } else {
      delete this.docs.basePath
    }
  }
  /**
   * Adds the required metadata to the Swagger documentation.
   * @param  {Object} options Swagger metadata
   * @param  {Object} options.info Global information
   * @param  {String} options.info.version The API version
   * @param  {String} options.info.title The API title
   * @param  {String} options.info.description The API description
   * @param  {String} options.host The API host
   */
  swagger (options) {
    const sw = this.docs
    const Router = this.router
    this.docs = { ...sw, ...options }
    const router = new Router(this.opts)
    router.get('/', (ctx) => {
      ctx.body = this.docs
    })
    return router
  }
  /**
   * Create a Resource configured on top of the rester, this Resource instance
   * has it own Router and KoaResterPersistence instances.
   *
   * @param {Object} model A native instance of the supported ORM. If persitence
   * is kr-presistence-mongoose it should be a Mongoose model.
   * @param {String} name The resource name used to build the resource URI without
   * slashes i.e. 'resourceName'.
   * @return {Resource} A Resource instance
   */
  add (model, name) {
    const Persistence = this.persistence
    const Router = this.router
    if (this.logger) this.logger.log(`Resource ${name} created`)
    return new Resource({
      router: new Router(this.opts),
      model: new Persistence(model),
      path: name,
      logger: this.logger,
      rester: this
    })
  }
}

module.exports = Rester
