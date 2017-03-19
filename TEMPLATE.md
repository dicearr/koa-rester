# koa-rester

[![Build Status](https://travis-ci.org/dicearr/koa-rester.svg?branch=master)](https://travis-ci.org/dicearr/koa-rester)
[![Coverage Status](https://coveralls.io/repos/github/dicearr/koa-rester/badge.svg?branch=master)](https://coveralls.io/github/dicearr/koa-rester?branch=master)
[![dependencies Status](https://david-dm.org/dicearr/koa-rester/status.svg)](https://david-dm.org/dicearr/koa-rester)

> [Koa](https://github.com/koajs/koa) library for deploying RESTful APIs easily

* Highly extensible/editable
* Native support for [mongoose](https://github.com/Automattic/mongoose) and [ORM](https://github.com/dresende/node-orm2)
* One line to deploy an API Rest from a Model
* Tested with [koa-router](https://github.com/alexmingoia/koa-router/tree/master/) but it'll work with almost any router that provides get|post|put|delete operations.
* Tested with [koa-bodyparser](https://github.com/koajs/bodyparser) 

## Installation

```
$ npm install koa-rester
```


## Usage
```javascript
const router = new Router();

router.use(bodyParser());
rester = new Rester({ router });

// Expose GET, POST /test/resource 
//        GET, PATCH, DELETE /test/resource/:id
rester.add(model, 'test/resource').rest();

// Expose GET /test/resource1 
//        GET /test/resource1/:id
rester.add(model1, 'test/resource1').list().get();

new Koa()
  .use(r.routes())
  .use(r.allowedMethods())
  .listen(30001);
```
More complex examples with model definitions included are located in test files.

## API Reference

{{>main}}
