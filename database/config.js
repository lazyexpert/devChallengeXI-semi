module.exports = {
  connectionString: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/devChallenge',
  interserviceToken: process.env.INTERSERVICE_AUTHORIZATION || 'lol'
};