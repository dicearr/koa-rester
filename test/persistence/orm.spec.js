const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const orm = require('orm');
const Koa = require('koa');
const request = require('supertest');
const bodyParser = require('koa-bodyparser');

/**
 * @param {boolean} withSync If the table has to be created.
 * @return {Promise} Resolved with the node orm2 model or rejected with an error
 */
function wrapper(withSync = true) {
  return new Promise((resolve, reject) => {
    orm.connect('mysql://root@localhost:3306/test', (err, db) => {
      if (err) reject(err);
      const model = db.define('users', {
        title: {
          type: 'text',
          required: true,
        },
        description: {
          type: 'text',
          required: true,
        },
        _id: {
          type: 'serial',
          key: true,
        }, // the auto-incrementing primary key
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
    const router = new Router();
    const base = 'test';
    router.use(bodyParser());
    rester = new Rester({
      router,
      base,
    });
  });
  it('GET /test/resource should return 500 if the table does not exists', async () => {
    const c = await wrapper(false);
    const r = rester.add(c.model, 'resource').list().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .get('/test/resource')
      .expect(500);
    expect(res.body.status).to.equal(500);
    expect(res.body.message).to.equal('Internal error');
    c.db.drop();
  });
  it('GET /test/resource should return an empty list', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').list().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .get('/test/resource')
      .expect(200);
    expect(res.body).to.be.instanceof(Array);
    expect(res.body.length).to.equal(0);
  });
  it('POST /test/resource should add a new resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').post().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .post('/test/resource')
      .send({ title: 'tit', description: 'desc' })
      .expect(201);
    expect(res.body.title).to.equal('tit');
    expect(res.body.description).to.equal('desc');
  });
  it('POST /test/resource should return 422 with an invalid data', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').post().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .post('/test/resource')
      .send({ foo: 'tit', bar: 'desc' })
      .expect(422);
    expect(res.status).to.equal(422);
    expect(res.body.status).to.equal(422);
    expect(res.body.message).to.equal('Invalid data');
  });
  it('GET /test/resource/:id should return a valid resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').get().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .get('/test/resource/1')
      .expect(200);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('tit');
    expect(res.body.description).to.equal('desc');
  });
  it('PATCH /test/resource/:id should return a modified resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').patch().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .patch('/test/resource/1')
      .send({ title: 'tit2' })
      .expect(200);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('tit2');
    expect(res.body.description).to.equal('desc');
  });
  it('DELETE /test/resource/:id should return a modified resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').delete().router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .delete('/test/resource/1')
      .expect(200);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('tit2');
    expect(res.body.description).to.equal('desc');
    c.db.drop();
  });
});
