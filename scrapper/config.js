module.exports = {
  interserviceToken: process.env.INTERSERVICE_AUTHORIZATION || 'lol',
  urls: [
    'http://brovary-rada.gov.ua/'
  ],
  limit: 100,
  delayInMs: 10
};