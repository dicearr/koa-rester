# koa-rester

[![Build Status](https://travis-ci.org/dicearr/koa-rester.svg?branch=master)](https://travis-ci.org/dicearr/koa-rester)
[![Coverage Status](https://coveralls.io/repos/github/dicearr/koa-rester/badge.svg?branch=master)](https://coveralls.io/github/dicearr/koa-rester?branch=master)
[![dependencies Status](https://david-dm.org/dicearr/koa-rester/status.svg)](https://david-dm.org/dicearr/koa-rester)
[![Inline docs](http://inch-ci.org/github/dicearr/koa-rester.svg?branch=master)](http://inch-ci.org/github/dicearr/koa-rester)

> [Koa](https://github.com/koajs/koa) library for deploying RESTful APIs easily

## TODO

### Mongoose
- [x] GET /resource
- [x] POST /resource
- [ ] **GET /resource/:id**
- [ ] PATCH /resource/:id
- [ ] PUT /resource/:id
- [ ] DELETE /resource/:id

### ORM
- [x] GET /resource
- [x] POST /resource
- [ ] **GET /resource/:id**
- [ ] PATCH /resource/:id
- [ ] PUT /resource/:id
- [ ] DELETE /resource/:id

## API Reference

<a name="module_koa-rester"></a>

## koa-rester

* [koa-rester](#module_koa-rester)
    * [Rester](#exp_module_koa-rester--Rester) ⏏
        * [new Rester(options)](#new_module_koa-rester--Rester_new)
        * _instance_
            * [.add(model, base)](#module_koa-rester--Rester+add) ⇒ <code>Rester</code>
            * [.list(options)](#module_koa-rester--Rester+list) ⇒ <code>Rester</code>
            * [.post(options)](#module_koa-rester--Rester+post) ⇒ <code>Rester</code>
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

<a name="module_koa-rester--Rester.errorHandler"></a>

#### Rester.errorHandler(error) ⇒ <code>Object</code>
Converts a persistence layer error into a JSON error. Json erros must have
at least 2 properties 'status' and 'message'. Status will be the http status
code of the response so it must be a valid one. This handler supports only
mongoose and orm2 errors. If any other DBMS is required it can be overwritten
via Rester's option errorHandler.

**Kind**: static method of <code>[Rester](#exp_module_koa-rester--Rester)</code>  
**Returns**: <code>Object</code> - The JSON that should be returned via http.  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Object</code> | The error object thrown from the persistence layer. |
