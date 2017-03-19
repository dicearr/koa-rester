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
});

const isBuilt = function isBuilt(method, r) {
  const stack = r.routes().router.stack;
  expect(stack.length).to.equal(1);
  const layer = stack.pop();
  expect(layer.path).to.equal('/test/resource');
  expect(layer.methods).to.include(method);
  expect(layer.stack.length).to.be.at.least(1);
};
