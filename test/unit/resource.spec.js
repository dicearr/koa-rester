const Router = require('koa-router')
const Resource = require('../../lib/resource')

describe('Resource: ', () => {
  describe('.constructor', () => {
    it('should wrap the model', () => {
      const res = new Resource({
        model: new Persistence({}),
        path: 'resource',
        router: Router
      })
      expect(res.model).toBeInstanceOf(Persistence)
      expect(res.model.model).toBeInstanceOf(Object)
    })
  })
})
