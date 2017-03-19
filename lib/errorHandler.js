const errors = {
  422: {
    status: 422,
    message: 'Invalid data',
  },
  500: {
    status: 500,
    message: 'Internal error',
  },
};

 /**
 * Converts a persistence layer error into a JSON error. Json erros must have
 * at least 2 properties 'status' and 'message'. Status will be the http status
 * code of the response so it must be a valid one. This handler supports only
 * mongoose and orm2 errors. If any other DBMS is required it can be overwritten
 * via Rester's option errorHandler.
 * @memberof module:koa-rester
 * @name errorHandler
 * @method
 * @param  {Object} error The error object thrown from the persistence layer.
 * @return {Object}       The JSON that should be returned via http.
 */
const errorHandler = function errorHandler(error) {
  if (error.name && error.name === 'ValidationError') { // Mongoose ValidationError
    return errors[422];
  } else if (error.type && error.type === 'validation') { // ORM2 Validation
    return errors[422];
  }
  return errors[500];
};

module.exports = errorHandler;
