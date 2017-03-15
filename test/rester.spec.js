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
  it('getList() should build /test/resource endpoint', () => {
    const r = rester.getList({}, 'test/resource').router;
    const stack = r.routes().router.stack;
    expect(stack.length).to.equal(1);
    const layer = stack.pop();
    expect(layer.path).to.equal('/test/resource');
    expect(layer.methods).to.include('GET');
    expect(layer.stack.length).to.be.at.least(1);
  });
});
