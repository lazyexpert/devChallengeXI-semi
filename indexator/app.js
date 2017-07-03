const hosts = require('../common_modules/hosts');
const config = require('./config');

const request = require('request-promise');

const interserviceToken = config.interserviceToken;
const databaseUri = `http://${hosts.database.host}:${hosts.database.port}/`;

const databaseClient = require('../common_modules/database-client')(interserviceToken, databaseUri, request);

const updateCalculator = require('./modules/update-calculator')(config.usualUpdatePlan, config.failedPenalty);
const newsUpdater = require('./modules/news-updater')(databaseClient, updateCalculator);
const newsComparator = require('./modules/news-comparator')(databaseClient);
const queueManager = require('./modules/queue-manager')(databaseClient);

const indexator = require('./modules/indexator')(
  databaseClient, newsUpdater, newsComparator, queueManager, config.indexDelay);

const scheduler = require('../common_modules/scheduler')(indexator, config.schedulerInterval);
const gracefulShutdown = require('../common_modules/graceful-shutdown')(process);

console.log('starting init');

scheduler.start();

gracefulShutdown(function() {
  console.log('Performing graceful shutdown');
  scheduler.stop();
});
