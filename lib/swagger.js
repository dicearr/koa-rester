module.exports.metadata = () => ({
  swagger: '2.0',
  info: {
    version: 'unknown',
    title: 'Unknown API',
    description: 'A cool API'
  },
  schema: [
    'https'
  ],
  host: 'somewhere',
  basePath: '',
  paths: {}
})

const notRequired = (schema) => {
  if (schema) {
    delete schema.required
  }
  return schema
}

module.exports.skeleton = (name, schema) => ({
  'false': {
    get: {
      description: `Returns a list of ${name}s`
    },
    post: {
      description: `Creates a ${name} and returns its id`,
      parameters: [{
        name,
        in: 'body',
        descrition: `The ${name} to create`,
        schema: schema || {}
      }]
    }
  },
  'true': {
    patch: {
      description: `Modifies a ${name} and returns the old one`,
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        description: `The ${name} identifier`,
        type: 'string'
      }, {
        name,
        in: 'body',
        descrition: `The ${name} to create`,
        schema: notRequired(schema) || {}
      }]
    },
    put: {
      description: `Replaces a ${name} and returns the old one`,
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        description: `The ${name} identifier`,
        type: 'string'
      }, {
        name,
        in: 'body',
        descrition: `The ${name} to create`,
        schema: schema || {}
      }]
    },
    delete: {
      description: `Removes a ${name}`,
      parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        description: `The ${name} identifier`,
        type: 'string'
      }]
    }
  }
})
