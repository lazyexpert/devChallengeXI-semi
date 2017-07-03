module.exports = {
  interserviceToken: process.env.INTERSERVICE_AUTHORIZATION || 'lol',
  schedulerInterval: 20 * 1000,
  indexDelay: 100,
  usualUpdatePlan: 5*60*1000,
  failedPenalty: 60*1000
};