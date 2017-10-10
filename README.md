# koa-rester

[![Build Status](https://travis-ci.org/dicearr/koa-rester.svg?branch=master)](https://travis-ci.org/dicearr/koa-rester)
[![Coverage Status](https://coveralls.io/repos/github/dicearr/koa-rester/badge.svg?branch=master)](https://coveralls.io/github/dicearr/koa-rester?branch=master)
[![dependencies Status](https://david-dm.org/dicearr/koa-rester/status.svg)](https://david-dm.org/dicearr/koa-rester)
![](https://img.shields.io/npm/dm/koa-rester.png)

> [Koa](https://github.com/koajs/koa) based framework for deploying RESTful APIs easily. Inspired by [travist/resourcejs](https://github.com/travist/resourcejs).


* One line to deploy a REST API from a Model
* Persistence packages (see [wiki](https://github.com/dicearr/koa-rester/wiki) if you want to create your own)
  * In memory [dicearr/kr-persistence-inmemory](https://github.com/dicearr/kr-persistence-inmemory)
  * Mongoose [dicearr/kr-persistence-mongoose](https://github.com/dicearr/kr-presistence-mongoose)
  * ~~Sequelize [dicearr/kr-persistence-sequelize](https://github.com/dicearr/kr-presistence-sequelize)~~
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

## Classes

<dl>
<dt><a href="#Rester">Rester</a></dt>
<dd></dd>
<dt><a href="#Resource">Resource</a></dt>
<dd></dd>
</dl>

<a name="Rester"></a>

## Rester
**Kind**: global class  

* [Rester](#Rester)
    * [new Rester(options)](#new_Rester_new)
    * [.add(model, name)](#Rester+add) ⇒ [<code>Resource</code>](#Resource)

<a name="new_Rester_new"></a>

### new Rester(options)
Create a rester.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration object. |
| options.router | <code>Router</code> | The router to be used, by default koa-router, change this property can break the package. |
| options.routerOptions | <code>Object</code> | The options that will be passed to [koa-router](https://github.com/alexmingoia/koa-router#new_module_koa-router--Router_new) constructor. If options.router is overwritten with any other router this options must be changed according to the new router. |
| options.log | <code>function</code> | The function used to log the events |
| options.persistence | <code>KoaResterPersistence</code> | An instance of KoaResterPersistence, such as [kr-presistence-sequelize](https://github.com/dicearr/kr-presistence-sequelize), [kr-persistence-inmemory](https://github.com/dicearr/kr-persistence-inmemory) or [kr-presistence-mongoose](https://github.com/dicearr/kr-presistence-mongoose). This property is compulsory, an error will be thrown if it is not present. |

<a name="Rester+add"></a>

### rester.add(model, name) ⇒ [<code>Resource</code>](#Resource)
Create a Resource configured on top of the rester, this Resource instance
has it own Router and KoaResterPersistence instances.

**Kind**: instance method of [<code>Rester</code>](#Rester)  
**Returns**: [<code>Resource</code>](#Resource) - A Resource instance  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | A native instance of the supported ORM. If persitence is kr-presistence-mongoose it should be a Mongoose model. |
| name | <code>String</code> | The resource name used to build the resource URI without slashes i.e. 'resourceName'. |

<a name="Resource"></a>

## Resource
**Kind**: global class  

* [Resource](#Resource)
    * [new Resource(options)](#new_Resource_new)
    * [.list(options)](#Resource+list) ⇒ [<code>Resource</code>](#Resource)
    * [.get(options)](#Resource+get) ⇒ [<code>Resource</code>](#Resource)
    * [.post(options)](#Resource+post) ⇒ [<code>Resource</code>](#Resource)
    * [.patch(options)](#Resource+patch) ⇒ [<code>Resource</code>](#Resource)
    * [.put(options)](#Resource+put) ⇒ [<code>Resource</code>](#Resource)
    * [.delete(options)](#Resource+delete) ⇒ [<code>Resource</code>](#Resource)
    * [.rest(options)](#Resource+rest) ⇒ [<code>Resource</code>](#Resource)
    * [.routes()](#Resource+routes) ⇒ <code>function</code>
    * [.allowedMethods()](#Resource+allowedMethods) ⇒ <code>function</code>

<a name="new_Resource_new"></a>

### new Resource(options)
Should not be used directly. Build Resource through [Rester.add](#Rester+add).


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options |

<a name="Resource+list"></a>

### resource.list(options) ⇒ [<code>Resource</code>](#Resource)
Create the GET /resource endpoint in the Resource router.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before the list method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after the list method. |

<a name="Resource+get"></a>

### resource.get(options) ⇒ [<code>Resource</code>](#Resource)
Create the GET /resource/:id endpoint in the Resource router.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before the list method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after the list method. |

<a name="Resource+post"></a>

### resource.post(options) ⇒ [<code>Resource</code>](#Resource)
Create the POST /resource endpoint in the Resource router.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before the create method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after the create method. |

<a name="Resource+patch"></a>

### resource.patch(options) ⇒ [<code>Resource</code>](#Resource)
Create the PATCH /resource/:id endpoint in the Resource router.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before the update method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after the update method. |

<a name="Resource+put"></a>

### resource.put(options) ⇒ [<code>Resource</code>](#Resource)
Create the PUT /resource/:id endpoint in the Resource router.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before the replace method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after the replace method. |

<a name="Resource+delete"></a>

### resource.delete(options) ⇒ [<code>Resource</code>](#Resource)
Create the DELETE /resource/:id endpoint in the Resource router.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before the delete method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after the delete method. |

<a name="Resource+rest"></a>

### resource.rest(options) ⇒ [<code>Resource</code>](#Resource)
Create all the endpoints

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The configuration for all the endpoints |
| options.before | <code>function</code> | The middleware or array of middlewares that will be executed before any method. |
| options.after | <code>function</code> | The middleware or array of middlewares that will be executed after all the methods. |
| options.afterList | <code>function</code> | options.after for list() |
| options.beforeList | <code>function</code> | options.before for list() |
| options.afterGet | <code>function</code> | options.after for get() |
| options.beforeGet | <code>function</code> | options.before for get() |
| options.afterPost | <code>function</code> | options.after for post() |
| options.beforePost | <code>function</code> | options.before for post() |
| options.afterPut | <code>function</code> | options.after for put() |
| options.beforePut | <code>function</code> | options.before for put() |
| options.afterDelete | <code>function</code> | options.after for delete() |
| options.beforeDelete | <code>function</code> | options.before for delete() |
| options.afterPatch | <code>function</code> | options.after for patch() |
| options.beforePatch | <code>function</code> | options.before for patch() |

<a name="Resource+routes"></a>

### resource.routes() ⇒ <code>function</code>
Sugar syntax that returns resource.router.routes()

**Kind**: instance method of [<code>Resource</code>](#Resource)  
<a name="Resource+allowedMethods"></a>

### resource.allowedMethods() ⇒ <code>function</code>
Sugar syntax that returns resource.router.allowedMethods()

**Kind**: instance method of [<code>Resource</code>](#Resource)  
