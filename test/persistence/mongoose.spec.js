const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const mongoose = require('mongoose');
const Koa = require('koa');
const request = require('supertest');
const bodyParser = require('koa-bodyparser');

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
    const router = new Router();
    router.use(bodyParser());
    rester = new Rester({ router });
  });
  after((done) => {
    mongoose.connection.db.dropCollection('resources', () => done());
  });
  it('GET /test/resource should return an empty list', (done) => {
    const r = rester.add(model, 'test/resource').list().router;
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
  it('POST /test/resource should add a new resource', (done) => {
    const r = rester.add(model, 'test/resource').post().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .post('/test/resource')
      .send({ title: 'tit', description: 'desc' })
      .expect(201)
      .then((res) => {
        expect(res.body.title).to.equal('tit');
        expect(res.body.description).to.equal('desc');
        done();
      });
  });
  it('POST /test/resource should return 422 with an invalid data', (done) => {
    const r = rester.add(model, 'test/resource').post().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .post('/test/resource')
      .send({ foo: 'tit', bar: 'desc' })
      .expect(422)
      .then((res) => {
        expect(res.status).to.equal(422);
        expect(res.body.status).to.equal(422);
        expect(res.body.message).to.equal('Invalid data');
        done();
      });
  });
});
