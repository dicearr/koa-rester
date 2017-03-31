const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const mongoose = require('mongoose');
const Koa = require('koa');
const request = require('supertest');
const bodyParser = require('koa-bodyparser');
const sinon = require('sinon');

mongoose.Promise = Promise;
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
let id;

mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', console.error);

describe('Mongoose CRUD operations', () => {
  let rester;
  const before = sinon.spy(async (ctx, next) => {
    try { await next(); } catch (err) { ctx.status = 500; }
  });
  const after = sinon.spy(async (ctx, next) => {
    try { await next(); } catch (err) { ctx.status = 500; }
  });
  beforeEach(() => {
    const router = new Router();
    const base = 'test';
    router.use(bodyParser());
    rester = new Rester({ router, base });
    after.reset();
    before.reset();
  });
  after((done) => {
    mongoose.connection.db.dropCollection('resources', () => done());
  });
  it('GET /test/resource should return an empty list', (done) => {
    const r = rester.add(model, 'resource').list({ before, after }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get('/test/resource')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.instanceof(Array);
        expect(res.body.length).to.equal(0);
        expect(before.calledOnce).to.equal(true);
        expect(after.calledOnce).to.equal(true);
        done();
      });
  });
  it('POST /test/resource should add a new resource', (done) => {
    const r = rester.add(model, 'resource').post({ before, after }).router;
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
        expect(before.calledOnce).to.equal(true);
        expect(after.calledOnce).to.equal(true);
        id = res.body._id;
        done();
      });
  });
  it('POST /test/resource should return 422 with an invalid data', (done) => {
    const r = rester.add(model, 'resource').post({ before, after }).router;
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
        expect(before.calledOnce).to.equal(true);
        done();
      });
  });
  it('GET /test/resource/:id should return a valid resource', (done) => {
    const r = rester.add(model, 'resource').get({ before, after }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get(`/test/resource/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('tit');
        expect(res.body.description).to.equal('desc');
        expect(res.body._id).to.equal(id);
        expect(before.calledOnce).to.equal(true);
        expect(after.calledOnce).to.equal(true);
        done();
      });
  });
  it('PATCH /test/resource/:id should return a modified resource', (done) => {
    const r = rester.add(model, 'resource').patch({ before, after }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .patch(`/test/resource/${id}`)
      .send({ title: 'tit2' })
      .expect(200)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('tit2');
        expect(res.body.description).to.equal('desc');
        expect(res.body._id).to.equal(id);
        expect(before.calledOnce).to.equal(true);
        expect(after.calledOnce).to.equal(true);
        done();
      });
  });
  it('DELETE /test/resource/:id should return a deleted resource', (done) => {
    const r = rester.add(model, 'resource').delete({ before, after }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .delete(`/test/resource/${id}`)
      .expect(200)
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('tit2');
        expect(res.body.description).to.equal('desc');
        expect(res.body._id).to.equal(id);
        expect(before.calledOnce).to.equal(true);
        expect(after.calledOnce).to.equal(true);
        done();
      });
  });
});
