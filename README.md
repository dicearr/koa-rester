# koa-rester

[![Build Status](https://travis-ci.org/dicearr/koa-rester.svg?branch=master)](https://travis-ci.org/dicearr/koa-rester)
[![Coverage Status](https://coveralls.io/repos/github/dicearr/koa-rester/badge.svg?branch=master)](https://coveralls.io/github/dicearr/koa-rester?branch=master)
[![dependencies Status](https://david-dm.org/dicearr/koa-rester/status.svg)](https://david-dm.org/dicearr/koa-rester)
![](https://img.shields.io/npm/dm/koa-rester.png)

> [Koa](https://github.com/koajs/koa) library for deploying RESTful APIs easily

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

More complex examples, with model definitions included, are located in the [wiki](https://github.com/dicearr/koa-rester/wiki).

## API Reference

<a name="module_koa-rester"></a>

## koa-rester

* [koa-rester](#module_koa-rester)
    * [Rester](#exp_module_koa-rester--Rester) ⏏
        * [new Rester(options)](#new_module_koa-rester--Rester_new)
        * _instance_
            * [.add(model, base)](#module_koa-rester--Rester+add) ⇒ <code>Rester</code>
            * [.rest(options)](#module_koa-rester--Rester+rest) ⇒ <code>Rester</code>
            * [.list(options)](#module_koa-rester--Rester+list) ⇒ <code>Rester</code>
            * [.post(options)](#module_koa-rester--Rester+post) ⇒ <code>Rester</code>
            * [.get(options)](#module_koa-rester--Rester+get) ⇒ <code>Rester</code>
            * [.patch(options)](#module_koa-rester--Rester+patch) ⇒ <code>Rester</code>
            * [.delete(options)](#module_koa-rester--Rester+delete) ⇒ <code>Rester</code>
        * _static_
            * [.errorHandler(error)](#module_koa-rester--Rester.errorHandler) ⇒ <code>Object</code>

<a name="exp_module_koa-rester--Rester"></a>

### Rester ⏏
**Kind**: Exported class  
<a name="new_module_koa-rester--Rester_new"></a>

#### new Rester(options)
Create a new Rester.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration object. Property router is compulsory. |

<a name="module_koa-rester--Rester+add"></a>

#### rester.add(model, base) ⇒ <code>Rester</code>
**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - A new Rester instance configured with the given model and
base.  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The persistence layer Model object. |
| base | <code>String</code> | Base URL from which the resource API will be built. |

<a name="module_koa-rester--Rester+rest"></a>

#### rester.rest(options) ⇒ <code>Rester</code>
Build the endpoints /resource and /resource/:id with the methods GET, POST
PUT, PATCH and DELETE.

**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - The Rester itself.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The resource specific options. |

<a name="module_koa-rester--Rester+list"></a>

#### rester.list(options) ⇒ <code>Rester</code>
Build the endpoint /resource allowing GET requests. It will respond with
all the resources available in the persistence layer.

**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - The Rester itself.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The endpoint specific options. |

<a name="module_koa-rester--Rester+post"></a>

#### rester.post(options) ⇒ <code>Rester</code>
Build the endpoint /resource allowing POST requests. It will save the resource
received in the persistence layer.

**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - The Rester itself.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The endpoint specific options. |

<a name="module_koa-rester--Rester+get"></a>

#### rester.get(options) ⇒ <code>Rester</code>
Build the endpoint /resource/:id allowing GET requests. It will return the resource
with the id given in the url.

**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - The Rester itself.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The endpoint specific options. |

<a name="module_koa-rester--Rester+patch"></a>

#### rester.patch(options) ⇒ <code>Rester</code>
Build the endpoint /resource/:id allowing PATCH requests. It will modify the resource
with the id given in the url.

**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - The Rester itself.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The endpoint specific options. |

<a name="module_koa-rester--Rester+delete"></a>

#### rester.delete(options) ⇒ <code>Rester</code>
Build the endpoint /resource/:id allowing DELETE requests. It will remove the resource
with the id given in the url.

**Kind**: instance method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Rester</code> - The Rester itself.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The endpoint specific options. |

<a name="module_koa-rester--Rester.errorHandler"></a>

#### Rester.errorHandler(error) ⇒ <code>Object</code>
Converts a persistence layer error into a JSON error. JSON errors must have
at least 2 properties 'status' and 'message'. Status will be the http status
code of the response so it must be a valid one. This handler supports only
mongoose and orm2 errors. If any other DBMS is required it can be overwritten
via Rester's option errorHandler.

**Kind**: static method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Object</code> - The JSON that should be returned via http.  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Object</code> | The error object thrown from the persistence layer. |

