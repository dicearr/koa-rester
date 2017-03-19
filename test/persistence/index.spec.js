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
    });
  });
  it('GET /test/resource should return 500 on error', (done) => {
    const r = rester.add({}, 'test/resource').list().router;
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
});
