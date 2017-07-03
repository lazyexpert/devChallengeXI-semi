const Schema = require('mongoose').Schema;

const schema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  /**
   * This property will be very useful when running multiple instances
   */
  processing : {
    type: Boolean,
    default: false
  }
});

module.exports = function(connector) {
  const name = 'queueitem';
  const connection = connector(name, schema, { server: { poolSize: 100 } });

  return async function(fn) {
    if (!fn) return;
    const model = connection.model(name);
    return await fn(model);
  };
};