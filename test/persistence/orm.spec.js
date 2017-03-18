const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const orm = require('orm');
const Koa = require('koa');
const request = require('supertest');

/**
 * @param {boolean} withSync If the table has to be created.
 * @return {Promise} Resolved with the node orm2 model or rejected with an error
 */
function wrapper(withSync = true) {
  return new Promise((resolve, reject) => {
    orm.connect('mysql://root@localhost:3306/test', (err, db) => {
      if (err) reject(err);
      const model = db.define('users', {
        firstName: String,
        lastName: String,
      });
      if (withSync) {
        db.sync((nErr) => {
          if (nErr) reject(nErr);
          resolve({ model, db });
        });
      } else {
        resolve({ model, db });
      }
    });
  });
}

describe('ORM2 CRUD operations', () => {
  let rester;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
    });
  });
  it('GET /test/resource should return 500 if the table does not exists', async () => {
    const c = await wrapper(false);
    const r = rester.add(c.model, 'test/resource').getList().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get('/test/resource')
      .expect(500)
      .then((res) => {
        expect(res.body.status).to.equal(500);
        expect(res.body.message).to.equal('Internal error');
        c.db.drop();
      });
  });
  it('GET /test/resource should return an empty list', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'test/resource').getList().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    request(server.listen())
      .get('/test/resource')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.instanceof(Array);
        expect(res.body.length).to.equal(0);
        c.db.drop();
      });
  });
});
