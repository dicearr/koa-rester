const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const orm = require('orm');
const Koa = require('koa');
const request = require('supertest');

/**
 * @return {[type]} [description]
 */
function wrapper() {
  return new Promise((resolve, reject) => {
    orm.connect('mysql://root@localhost:3306/test', (err, db) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(db);
    });
  });
}

describe('ORM2 CRUD operations', () => {
  let rester;
  let model;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
    });
  });
  before(async () => {
    const db = await wrapper();
    model = db.define('users', {
      firstName: String,
      lastName: String,
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
