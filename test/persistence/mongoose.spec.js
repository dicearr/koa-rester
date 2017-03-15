const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const mongoose = require('mongoose');
const Koa = require('koa');
const request = require('supertest')('http://localhost:30001');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const model = mongoose.model('resource', schema);

describe('Mongoose CRUD operations', () => {
  let rester;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
    });
  });
  it('GET /test/resource should return an empty list', (done) => {
    const r = rester.getList(model, 'test/resource').router;
    new Koa()
      .use(r.routes())
      .use(r.allowedMethods())
      .listen(30001);
    request
      .get('/test/resource')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.instanceof(Array);
        expect(res.body.length).to.equal(0);
        done();
      });
  });
});
