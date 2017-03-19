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
 * Converts a persistence-layer error into an http error
 * @param  {Object} error The low level error
 * @return {Object}       The JSON error
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
