const Koa = require('koa')
const Rester = require('../../lib')
const Router = require('koa-router')

describe('Rester:', () => {
  describe('.swagger', () => {
    let rester
    beforeEach(() => {
      rester = new Rester({
        persistence: Persistence,
        routerOptions: {
          prefix: '/api'
        }
      })
    })
    it('sould return a router', () => {
      const docs = rester.swagger()
      expect(docs).toBeInstanceOf(Router)
    })
    describe('GET /api', () => {
      it('should have the swagger documentation', () => {
        const metadata = {
          info: {
            version: '0.0.1',
            title: 'Custom API',
            description: 'A cool API testing'
          },
          host: 'localhost'
        }
        const docs = rester.swagger(metadata)
        const resource = rester.add({}, 'resource').rest()
        const koa = new Koa()
        koa
          .use(docs.routes())
          .use(docs.allowedMethods())
          .use(resource.routes())
          .use(resource.allowedMethods())
        return request(koa.callback())
          .get('/api')
          .expect(200)
          .then((data) => {
            expect(data.body).toMatchObject(metadata)
            expect(data.body.paths).toMatchObject({
              '/resource': {
                get: {
                  description: 'Returns a list of resources'
                },
                post: {
                  description: 'Creates a resource and returns its id'
                }
              },
              '/resource/{id}': {
                patch: {
                  description: 'Modifies a resource and returns the old one'
                },
                put: {
                  description: 'Replaces a resource and returns the old one'
                },
                delete: {
                  description: 'Removes a resource'
                }
              }
            })
          })
      })
    })
  })
})
