const expect = require('chai').expect;
const Rester = require('../../lib/rester');
const Router = require('koa-router');
const orm = require('orm');
const Koa = require('koa');
const request = require('supertest');
const bodyParser = require('koa-bodyparser');
const sinon = require('sinon');

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
    rester = new Rester({
      router,
      base,
    });
    after.reset();
    before.reset();
  });
  it('GET /test/resource should return 500 if the table does not exists', async () => {
    const c = await wrapper(false);
    const r = rester.add(c.model, 'resource').rest({
      beforeList: before,
      afterList: after,
    }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .get('/test/resource')
      .expect(500);
    expect(res.body.status).to.equal(500);
    expect(res.body.message).to.equal('Internal error');
    expect(before.calledOnce).to.equal(true);
    c.db.drop();
  });
  it('GET /test/resource should return an empty list', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').rest({
      beforeList: before,
      afterList: after,
    }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .get('/test/resource')
      .expect(200);
    expect(res.body).to.be.instanceof(Array);
    expect(res.body.length).to.equal(0);
    expect(before.calledOnce).to.equal(true);
    expect(after.calledOnce).to.equal(true);
  });
  it('POST /test/resource should add a new resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').rest({
      beforePost: before,
      afterPost: after,
    }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .post('/test/resource')
      .send({ title: 'tit', description: 'desc' })
      .expect(201);
    expect(res.body.title).to.equal('tit');
    expect(res.body.description).to.equal('desc');
    expect(before.calledOnce).to.equal(true);
    expect(after.calledOnce).to.equal(true);
  });
  it('POST /test/resource should return 422 with an invalid data', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').rest({
      beforePost: before,
      afterPost: after,
    }).router;
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
    expect(before.calledOnce).to.equal(true);
  });
  it('GET /test/resource/:id should return a valid resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').rest({
      beforeGet: before,
      afterGet: after,
    }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .get('/test/resource/1')
      .expect(200);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('tit');
    expect(res.body.description).to.equal('desc');
    expect(before.calledOnce).to.equal(true);
    expect(after.calledOnce).to.equal(true);
  });
  it('PATCH /test/resource/:id should return a modified resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').rest({
      beforePatch: before,
      afterPatch: after,
    }).router;
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
    expect(before.calledOnce).to.equal(true);
    expect(after.calledOnce).to.equal(true);
  });
  it('DELETE /test/resource/:id should return a modified resource', async () => {
    const c = await wrapper();
    const r = rester.add(c.model, 'resource').rest({
      beforeDelete: before,
      afterDelete: after,
    }).router;
    const server = new Koa()
      .use(r.routes())
      .use(r.allowedMethods());
    const res = await request(server.listen())
      .delete('/test/resource/1')
      .expect(200);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('tit2');
    expect(res.body.description).to.equal('desc');
    expect(before.calledOnce).to.equal(true);
    expect(after.calledOnce).to.equal(true);
    c.db.drop();
  });
});
