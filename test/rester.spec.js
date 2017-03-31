const expect = require('chai').expect;
const Rester = require('../lib/rester');
const Router = require('koa-router');

describe('Rester', () => {
  let rester;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
      base: 'test',
    });
  });
  it('new Rester() should return an instance of Rester', () => {
    expect(rester).to.be.an.instanceof(Rester);
  });
  it('new Rester() should throw an exception if router is not defined', () => {
    expect(() => {
      new Rester(); // eslint-disable-line
    }).to.throw('Undefined router');
  });
  it('list() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'resource');
    expect(r.list()).to.equal(false);
    r = rester.add(null, null);
    expect(r.list()).to.equal(false);
    r = rester.add(null, 'resource');
    expect(r.list()).to.equal(false);
  });
  it('list() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'resource').list().router;
    isBuilt('GET', r);
  });
  it('post() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'resource');
    expect(r.post()).to.equal(false);
    r = rester.add(null, null);
    expect(r.post()).to.equal(false);
    r = rester.add(null, 'resource');
    expect(r.post()).to.equal(false);
  });
  it('post() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'resource').post().router;
    isBuilt('POST', r);
  });
  it('get() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'resource');
    expect(r.get()).to.equal(false);
    r = rester.add(null, null);
    expect(r.get()).to.equal(false);
    r = rester.add(null, 'resource');
    expect(r.get()).to.equal(false);
  });
  it('get() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'resource').get().router;
    isBuilt('GET', r, '/:id');
  });
  it('patch() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'resource');
    expect(r.patch()).to.equal(false);
    r = rester.add(null, null);
    expect(r.patch()).to.equal(false);
    r = rester.add(null, 'resource');
    expect(r.patch()).to.equal(false);
  });
  it('patch() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'resource').patch().router;
    isBuilt('PATCH', r, '/:id');
  });
  it('delete() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'resource');
    expect(r.delete()).to.equal(false);
    r = rester.add(null, null);
    expect(r.delete()).to.equal(false);
    r = rester.add(null, 'resource');
    expect(r.delete()).to.equal(false);
  });
  it('delete() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'resource').delete().router;
    isBuilt('DELETE', r, '/:id');
  });
  it('rest() should build all the endpoints', () => {
    const r = rester.add({}, 'resource').rest().router;
    const stack = r.routes().router.stack;
    expect(stack.length).to.equal(5);
    let layer = stack.pop();
    expect(layer.path).to.equal('/test/resource/:id');
    expect(layer.methods).to.include('DELETE');
    expect(layer.stack.length).to.be.at.least(1);
    layer = stack.pop();
    expect(layer.path).to.equal('/test/resource/:id');
    expect(layer.methods).to.include('PATCH');
    expect(layer.stack.length).to.be.at.least(1);
    layer = stack.pop();
    expect(layer.path).to.equal('/test/resource/:id');
    expect(layer.methods).to.include('GET');
    expect(layer.stack.length).to.be.at.least(1);
    layer = stack.pop();
    expect(layer.path).to.equal('/test/resource');
    expect(layer.methods).to.include('POST');
    expect(layer.stack.length).to.be.at.least(1);
    layer = stack.pop();
    expect(layer.path).to.equal('/test/resource');
    expect(layer.methods).to.include('GET');
    expect(layer.stack.length).to.be.at.least(1);
  });
});

const isBuilt = function isBuilt(method, r, extra = '') {
  const stack = r.routes().router.stack;
  expect(stack.length).to.equal(1);
  const layer = stack.pop();
  expect(layer.path).to.equal(`/test/resource${extra}`);
  expect(layer.methods).to.include(method);
  expect(layer.stack.length).to.be.at.least(1);
};
