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
  updatedAt : {
    type: Date,
    default: Date.now
  },
  updatePlan: {
    type: Date,
    default: Date.now
  },
  latestHash: String,
  totalIndex: {
    type: Number,
    default: 0
  },
  totalChanged: {
    type: Number,
    default: 0
  },
  totalFailed: {
    type: Number,
    default: 0
  },
  /**
   * When we launch multiple instances of indexator - this property will be very handy
   */
  processing: {
    type: Boolean,
    default: false
  }
});

module.exports = function(connector) {
  const name = 'news';
  const connection = connector(name, schema, { server: { poolSize: 100 } });

  return async function(fn) {
    if (!fn) return;
    const model = connection.model(name);
    return await fn(model);
  };
};