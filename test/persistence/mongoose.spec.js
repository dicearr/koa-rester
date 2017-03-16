const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const mongoose = require('mongoose');
const Koa = require('koa');
const request = require('supertest');

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

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', console.error);

describe('Mongoose CRUD operations', () => {
  let rester;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
    });
  });
  it('GET /test/resource should return an empty list', (done) => {
    const r = rester.add(model, 'test/resource').getList().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get('/test/resource')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.instanceof(Array);
        expect(res.body.length).to.equal(0);
        done();
      });
  });
});
