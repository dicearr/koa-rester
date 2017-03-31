# koa-rester

[![Build Status](https://travis-ci.org/dicearr/koa-rester.svg?branch=master)](https://travis-ci.org/dicearr/koa-rester)
[![Coverage Status](https://coveralls.io/repos/github/dicearr/koa-rester/badge.svg?branch=master)](https://coveralls.io/github/dicearr/koa-rester?branch=master)
[![dependencies Status](https://david-dm.org/dicearr/koa-rester/status.svg)](https://david-dm.org/dicearr/koa-rester)
![](https://img.shields.io/npm/dm/koa-rester.png)

> [Koa](https://github.com/koajs/koa) based framework for deploying RESTful APIs easily

* Highly extensible/editable
* Native support for [mongoose](https://github.com/Automattic/mongoose) and [ORM](https://github.com/dresende/node-orm2)
* One line to deploy an API Rest from a Model
* Tested with [koa-router](https://github.com/alexmingoia/koa-router/tree/master/) but it'll work with almost any router that provides get|post|put|delete operations.
* Tested with [koa-bodyparser](https://github.com/koajs/bodyparser) 
* Todo features are listed in [\#1](https://github.com/dicearr/koa-rester/issues/1)

## Installation
 
```
$ npm install koa-rester
```


## Usage
```javascript
const router = new Router();
const base = 'test';

router.use(bodyParser());
rester = new Rester({ router, base });

// Expose GET, POST /test/resource 
//        GET, PATCH, DELETE /test/resource/:id
rester.add(model, 'resource').rest({
  after: async (ctx, next) => {
    try {
      // It will be executed after all the REST requests
      await next();
    } catch (err) {
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
    },
    afterPost: async (ctx, next) => {
      try {
        // This will overwrite after middleware for POST
        await next();
      } catch (err) {
        ctx.body = { message: err.message };
        ctx.status = err.status || 500;
      }
    }
  }
});

// Expose GET /test/resource1 
//        GET /test/resource1/:id
rester.add(model1, 'resource1').list({
  before: async (ctx, next) => {
    try {
      // do something
      await next();
    } catch (err) {
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
    }
  }
}).get();

new Koa()
  .use(r.routes())
  .use(r.allowedMethods())
  .listen(30001);
```

More complex examples, with model definitions included, are located in the [wiki](https://github.com/dicearr/koa-rester/wiki).

## API Reference

{{>main}}
