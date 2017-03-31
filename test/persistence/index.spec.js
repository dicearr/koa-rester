const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const Koa = require('koa');
const request = require('supertest');

describe('Common CRUD operations', () => {
  let rester;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
      base: 'test',
    });
  });
  it('GET /test/resource should return 500 on error', (done) => {
    const r = rester.add({}, 'resource').list().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get('/test/resource')
      .expect(500)
      .then((res) => {
        expect(res.body.status).to.equal(500);
        expect(res.body.message).to.equal('Internal error');
        done();
      });
  });
  it('GET /test/resource/:id should return 500 on error', (done) => {
    const r = rester.add({}, 'resource').get().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get('/test/resource/1')
      .expect(500)
      .then((res) => {
        expect(res.body.status).to.equal(500);
        expect(res.body.message).to.equal('Internal error');
        done();
      });
  });
  it('PATCH /test/resource/:id should return 500 on error', (done) => {
    const r = rester.add({}, 'resource').patch().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .patch('/test/resource/1')
      .expect(500)
      .then((res) => {
        expect(res.body.status).to.equal(500);
        expect(res.body.message).to.equal('Internal error');
        done();
      });
  });
  it('DELETE /test/resource/:id should return 500 on error', (done) => {
    const r = rester.add({}, 'resource').delete().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .delete('/test/resource/1')
      .expect(500)
      .then((res) => {
        expect(res.body.status).to.equal(500);
        expect(res.body.message).to.equal('Internal error');
        done();
      });
  });
});
