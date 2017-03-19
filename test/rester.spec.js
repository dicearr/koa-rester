const expect = require('chai').expect;
const Rester = require('../lib/rester');
const Router = require('koa-router');

describe('Rester', () => {
  let rester;
  beforeEach(() => {
    rester = new Rester({
      router: new Router(),
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
    let r = rester.add(null, 'test/resource');
    expect(r.list()).to.equal(false);
    r = rester.add({}, null);
    expect(r.list()).to.equal(false);
    r = rester.add(null, 'test/resource');
    expect(r.list()).to.equal(false);
  });
  it('list() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'test/resource').list().router;
    isBuilt('GET', r);
  });
  it('post() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'test/resource');
    expect(r.post()).to.equal(false);
    r = rester.add({}, null);
    expect(r.post()).to.equal(false);
    r = rester.add(null, 'test/resource');
    expect(r.post()).to.equal(false);
  });
  it('post() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'test/resource').post().router;
    isBuilt('POST', r);
  });
  it('get() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'test/resource');
    expect(r.get()).to.equal(false);
    r = rester.add({}, null);
    expect(r.get()).to.equal(false);
    r = rester.add(null, 'test/resource');
    expect(r.get()).to.equal(false);
  });
  it('get() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'test/resource').get().router;
    isBuilt('GET', r, '/:id');
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
