const Rester = require('../../lib')
const Resource = require('../../lib/resource')

describe('Rester', () => {
  describe('.constructor', () => {
    it('should throw if no persistence provided', () => {
      expect(() => { new Rester({}) }).toThrow() // eslint-disable-line no-new
    })
    it('should return a Rester instance', () => {
      const r = new Rester({
        persistence: Persistence
      })
      expect(r).toBeTruthy()
      expect(r).toBeInstanceOf(Rester)
    })
  })
  describe('.add', () => {
    it('should return a Resource instance', () => {
      const res = (new Rester({
        persistence: Persistence
      })).add({}, 'resource')
      expect(res).toBeTruthy()
      expect(res).toBeInstanceOf(Resource)
    })
    it('should pass the options to the router', () => {
      const r = new Rester({
        persistence: Persistence,
        routerOptions: {
          prefix: 'api'
        },
        logger: { log: () => {} }
      }).add({}, 'resource')
      expect(r.routes().router.opts.prefix).toBe('api')
    })
  })
})
