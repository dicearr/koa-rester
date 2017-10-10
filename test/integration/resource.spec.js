const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const Resource = require('../../lib/resource')

describe('Resource:', () => {
  let koa
  let res

  beforeEach(() => {
    koa = new Koa()
    koa.silent = true
    koa.use(bodyParser())
    res = new Resource({
      model: new Persistence({}),
      path: 'resource',
      router: new Router()
    })
  })
  describe('.list', () => {
    beforeEach(() => {
      res.list()
      koa.use(res.routes())
      koa.use(res.allowedMethods())
    })
    it('should create GET /resource endpoint', () => {
      return request(koa.callback())
        .get('/resource')
        .expect(200)
    })
    describe('GET /resource endpoint', () => {
      it('should return an array of resources', () => {
        res.model.data = [{ id: 0 }, { id: 1 }]
        return request(koa.callback())
          .get('/resource')
          .expect(200)
          .then(data => {
            expect(data.body.data).toEqual(res.model.data)
          })
      })
      it('should throw the underlying errors', () => {
        res.model.list = () => Promise.reject(new Error())
        return request(koa.callback())
          .get('/resource')
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({})
          })
      })
    })
  })
  describe('.get', () => {
    beforeEach(() => {
      res.get()
      koa.use(res.routes())
      koa.use(res.allowedMethods())
      res.model.data = [{ id: 0 }]
    })
    it('should create GET /resource/:id endpoint', () => {
      return request(koa.callback())
        .get('/resource/0')
        .expect(200)
    })
    describe('GET /resource/:id endpoint', () => {
      it('should return 404 if cannot find resource', () => {
        return request(koa.callback())
          .get('/resource/1')
          .expect(404)
      })
      it('should throw the underlying errors', () => {
        res.model.list = () => Promise.reject(new Error())
        return request(koa.callback())
          .get('/resource/0')
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({})
          })
      })
      it('should return 200 and the document if exists', () => {
        return request(koa.callback())
          .get('/resource/0')
          .expect(200)
          .then(data => {
            expect(data.body.data).toEqual({ id: 0 })
          })
      })
    })
  })
  describe('.post', () => {
    beforeEach(() => {
      res.get().post()
      koa.use(res.routes())
      koa.use(res.allowedMethods())
    })
    it('should create POST /resource endpoint', () => {
      return request(koa.callback())
        .post('/resource')
        .expect(400)
    })
    describe('POST /resource endpoint', () => {
      it('should return 400 if validation fails', () => {
        return request(koa.callback())
          .post('/resource')
          .send({ valid: false })
          .expect(400)
      })
      it('should return 201 if is valid', () => {
        return request(koa.callback())
          .post('/resource')
          .send({ valid: true })
          .expect(201)
          .then(data => {
            return request(koa.callback())
              .get(data.body.link)
              .expect(200)
              .then(data => expect(data.body.data).toEqual({ valid: true }))
          })
      })
      it('should throw the underlying errors', () => {
        res.model.create = () => Promise.reject(new Error())
        return request(koa.callback())
          .post('/resource')
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({})
          })
      })
    })
  })
  describe('.patch', () => {
    beforeEach(() => {
      res.get().patch()
      koa.use(res.routes())
      koa.use(res.allowedMethods())
    })
    it('should create PATCH /resource endpoint', () => {
      return request(koa.callback())
        .patch('/resource/0')
        .expect(404)
    })
    describe('PATCH /resource endpoint', () => {
      it('should return 404 if resource not exists', () => {
        return request(koa.callback())
          .patch('/resource/0')
          .send({ valid: false })
          .expect(404)
      })
      it('should return 400 if updates not valid', () => {
        res.model.data = [{ id: 0 }]
        return request(koa.callback())
          .patch('/resource/0')
          .send({ valid: false })
          .expect(400)
      })
      it('should return 200 if is valid', () => {
        res.model.data = [{ untouched: true, value: 0 }]
        return request(koa.callback())
          .patch('/resource/0')
          .send({ valid: true, value: 1 })
          .expect(200)
          .then(data => expect(data.body.data.value).toBe(0))
          .then(() => {
            return request(koa.callback())
              .get('/resource/0')
              .expect(200)
              .then((data) => {
                expect(data.body.data.value).toBe(1)
                expect(data.body.data.untouched).toBe(true)
              })
          })
      })
      it('should throw the underlying errors', () => {
        res.model.data = [{ value: 0 }]
        res.model.update = () => Promise.reject(new Error())
        return request(koa.callback())
          .patch('/resource/0')
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({})
          })
      })
    })
  })
  describe('.put', () => {
    beforeEach(() => {
      res.get().put()
      koa.use(res.routes())
      koa.use(res.allowedMethods())
    })
    it('should create PUT /resource endpoint', () => {
      return request(koa.callback())
        .put('/resource/0')
        .expect(404)
    })
    describe('PUT /resource endpoint', () => {
      it('should return 404 if resource not exists', () => {
        return request(koa.callback())
          .put('/resource/0')
          .send({ valid: false })
          .expect(404)
      })
      it('should return 400 if updates not valid', () => {
        res.model.data = [{ id: 0 }]
        return request(koa.callback())
          .put('/resource/0')
          .send({ valid: false })
          .expect(400)
      })
      it('1123 should return 200 if is valid', () => {
        res.model.data = [{ untouched: true, value: 0 }]
        return request(koa.callback())
          .put('/resource/0')
          .send({ valid: true, value: 1 })
          .expect(200)
          .then(data => {
            expect(data.body.data.value).toBe(0)
            return request(koa.callback())
              .get('/resource/0')
              .expect(200)
              .then(data => {
                expect(data.body.data.value).toBe(1)
                expect(data.body.data.untouched).toBe(undefined)
              })
          })
      })
      it('should throw the underlying errors', () => {
        res.model.data = [{ value: 0 }]
        res.model.replace = () => Promise.reject(new Error())
        return request(koa.callback())
          .put('/resource/0')
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({})
          })
      })
    })
  })
  describe('.delete', () => {
    beforeEach(() => {
      res.list().delete()
      koa.use(res.routes())
      koa.use(res.allowedMethods())
    })
    it('should create DELETE /resource endpoint', () => {
      return request(koa.callback())
        .delete('/resource/0')
        .expect(404)
    })
    describe('DELETE /resource endpoint', () => {
      it('should return 404 if resource not exists', () => {
        return request(koa.callback())
          .delete('/resource/0')
          .expect(404)
      })
      it('should return 200 if is valid', () => {
        res.model.data = [{ untouched: true, value: 0 }]
        return request(koa.callback())
          .delete('/resource/0')
          .expect(200)
          .then(data => {
            return request(koa.callback())
              .get(data.body.link)
              .expect(200)
              .then(data => {
                expect(data.body.data).toEqual([])
              })
          })
      })
      it('should throw the underlying errors', () => {
        res.model.data = [{ value: 0 }]
        res.model.delete = () => Promise.reject(new Error())
        return request(koa.callback())
          .delete('/resource/0')
          .expect(500)
          .then(data => {
            expect(data.body).toEqual({})
          })
      })
    })
  })
  describe('.rest', () => {
    it('should create all the endpoints', () => {
      const ownres = new Resource({
        model: new Persistence({}),
        path: 'resource',
        router: new Router(),
        logger: { log: () => {} }
      })
      ownres.rest()
      koa.use(ownres.routes())
      koa.use(ownres.allowedMethods())
      return request(koa.callback())
        .get('/resource')
        .expect(200)
    })
  })
  describe('Middlewares', () => {
    const before = jest.fn()
    const after = jest.fn()
    const beforeList = jest.fn()
    const afterList = jest.fn()
    it('should be called', () => {
      res.rest({
        before: (ctx, next) => {
          before()
          next()
        },
        after: (ctx, next) => {
          after()
          next()
        },
        beforeList: [(ctx, next) => {
          beforeList()
          next()
        }, (ctx, next) => {
          before()
          next()
        }],
        afterList: (ctx, next) => {
          afterList()
          next()
        }
      })
      koa.use(res.routes())
      koa.use(res.allowedMethods())
      return request(koa.callback())
        .get('/resource')
        .expect(200)
        .then(() => {
          expect(before.mock.calls.length).toBe(2)
          expect(after.mock.calls.length).toBe(1)
          expect(beforeList.mock.calls.length).toBe(1)
          expect(afterList.mock.calls.length).toBe(1)
        })
    })
  })
})
