const hosts = require('../common_modules/hosts');
const config = require('./config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const gracefulShutdown = require('../common_modules/graceful-shutdown')(process);

const connector = require('./modules/connector')(config.connectionString, gracefulShutdown);

// Models
const queueModel = require('./models/queue-model')(connector);
const newsModel = require('./models/news-model')(connector);
const pageModel = require('./models/page-model')(connector);

// Routes
const queueInsertRoute = require('./routes/queue-insert')(queueModel, newsModel);
const queueDeleteRoute = require('./routes/queue-delete')(queueModel);
const queueAllRoute = require('./routes/queue-list')(queueModel);

const newsUpsertRoute = require('./routes/news-upsert')(newsModel);
const newsPopRoute = require('./routes/news-pop')(newsModel);
const newsUpdateRoute = require('./routes/news-update')(newsModel);
const newsAllRoute = require('./routes/news-all')(newsModel);
const newsSetRoute = require('./routes/news-get-set')(newsModel);

const pageGetLatestRoute = require('./routes/page-latest-get')(pageModel);
const pageAddRoute = require('./routes/page-add')(pageModel);
const pageGetVersionRoute = require('./routes/page-version-get')(pageModel);

// Middlewares
const errorHandler = require('../common_modules/error-handler')();
const httpLog = require('../common_modules/http-log')();
const authorization = require('../common_modules/interservice')(config.interserviceToken);

const middlewares = [
  authorization,
  httpLog
];

const routes = [
  queueInsertRoute,
  queueDeleteRoute,
  queueAllRoute,
  newsUpsertRoute,
  newsPopRoute,
  newsUpdateRoute,
  pageGetLatestRoute,
  pageAddRoute,
  newsAllRoute,
  pageGetVersionRoute,
  newsSetRoute
];

const additionalConfigs = {
  additionalSetup: [],
  port: hosts.database.port
};

const dependencies = { express, bodyParser, helmet };

const server = require('../common_modules/bootstrapper')(
    additionalConfigs, middlewares, routes, errorHandler, dependencies);

gracefulShutdown(function() {
  console.log('Shutting http server down');
  server.close();
});
