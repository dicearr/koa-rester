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
  it('getList() should return false if no model nor base are provided', () => {
    let r = rester.add(null, 'test/resource');
    expect(r.getList()).to.equal(false);
    r = rester.add({}, null);
    expect(r.getList()).to.equal(false);
    r = rester.add(null, 'test/resource');
    expect(r.getList()).to.equal(false);
  });
  it('getList() should build /test/resource endpoint', () => {
    const r = rester.add({}, 'test/resource').getList().router;
    const stack = r.routes().router.stack;
    expect(stack.length).to.equal(1);
    const layer = stack.pop();
    expect(layer.path).to.equal('/test/resource');
    expect(layer.methods).to.include('GET');
    expect(layer.stack.length).to.be.at.least(1);
  });
});
