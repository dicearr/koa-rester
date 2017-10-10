# koa-rester

[![Build Status](https://travis-ci.org/dicearr/koa-rester.svg?branch=master)](https://travis-ci.org/dicearr/koa-rester)
[![Coverage Status](https://coveralls.io/repos/github/dicearr/koa-rester/badge.svg?branch=master)](https://coveralls.io/github/dicearr/koa-rester?branch=master)
[![dependencies Status](https://david-dm.org/dicearr/koa-rester/status.svg)](https://david-dm.org/dicearr/koa-rester)
![](https://img.shields.io/npm/dm/koa-rester.png)

> [Koa](https://github.com/koajs/koa) based framework for deploying RESTful APIs easily. Inspired by [travist/resourcejs](https://github.com/travist/resourcejs).


* One line to deploy a REST API from a Model
* Persistence packages (see [wiki](https://github.com/dicearr/koa-rester/wiki) if you want to create your own)
 * KoaResterPersistence [dicearr/kr-persistence](https://github.com/dicearr/kr-persistence-seed)
 * In memory [dicearr/kr-persistence-inmemory](https://github.com/dicearr/kr-persistence-inmemory)
 * Mongo [dicearr/kr-persistence-mongo](https://github.com/dicearr/kr-presistence-mongo)
 * MariaDB [dicearr/kr-persistence-mariadb](https://github.com/dicearr/kr-presistence-mariadb)
* [koa-router](https://github.com/alexmingoia/koa-router/tree/master/) is used internally.
* Tested with [koa-bodyparser](https://github.com/koajs/bodyparser), other parsers could work.
* Todo features are listed in [\#1](https://github.com/dicearr/koa-rester/issues/1)

## Installation

```
$ npm install koa-rester
```


## Usage
```javascript
const koa = new Koa()
const rester = new Rester({
  persistence: require('kr-persistence-inmemory'),
})

koa.use(bodyParser())
/*
 * GET /name
 * GET /name/:id
 * POST /name
 * PUT /name/:id
 * PATCH /name/:id
 * DELETE /name/:id
 */
const nameResource = rester.add(model, 'name').rest()
/*
 * GET /otherName
 * GET /otherName/:id
 * POST /otherName
 */
const otherResource = rester.add(otherModel, 'otherName').get().list().post()

koa
  .use(nameResource.routes())
  .use(nameResource.allowedMethods())
  .use(otherResource.routes())
  .use(otherResource.allowedMethods())
```

More examples can be found in the [wiki](https://github.com/dicearr/koa-rester/wiki).

## API Reference

{{>main}}
