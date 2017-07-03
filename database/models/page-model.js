const Schema = require('mongoose').Schema;

const schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  }
});

module.exports = function(connector) {
  const name = 'page';
  const connection = connector(name, schema, { server: { poolSize: 100 } });

  return async function(fn) {
    if (!fn) return;
    const model = connection.model(name);
    return await fn(model);
  };
};