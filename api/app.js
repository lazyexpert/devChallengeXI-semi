const hosts = require('../common_modules/hosts');
const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const request = require('request-promise');

const gracefulShutdown = require('../common_modules/graceful-shutdown')(process);

const interserviceToken = config.interserviceToken;

const databaseUri = `http://${hosts.database.host}:${hosts.database.port}/`;
const databaseClient = require('../common_modules/database-client')(interserviceToken, databaseUri, request);

const scrapperUri = `http://${hosts.scrapper.host}:${hosts.scrapper.port}/`;
const scrapperClient = require('./modules/scrapper-client')(scrapperUri, interserviceToken);

const diffAnalyzer = require('./modules/diff-analyzer')();

// Middlewares
const errorHandler = require('../common_modules/error-handler')();
const httpLogger = require('../common_modules/http-log')();

const middlewares = [ httpLogger ];

// Routes
const addUrlRoute = require('./routes/add-url')(databaseClient);
const deleteUrlRoute = require('./routes/delete-url')(databaseClient);
const listUrlRoute = require('./routes/list-url')(databaseClient);
const launchScrapperRoute = require('./routes/launch-scrapper')(scrapperClient);
const newsAllRoute = require('./routes/news-all')(databaseClient);
const pageLatestRoute = require('./routes/page-latest')(databaseClient);
const pageVersionRoute = require('./routes/page-version')(databaseClient);
const pageCompareVersionsRoute = require('./routes/page-compare-versions')(databaseClient, diffAnalyzer);
const newsSetRoute = require('./routes/news-get-set')(databaseClient);

const routes = [
  addUrlRoute,
  deleteUrlRoute,
  listUrlRoute,
  launchScrapperRoute,
  newsAllRoute,
  pageLatestRoute,
  pageVersionRoute,
  pageCompareVersionsRoute,
  newsSetRoute
];

const additionalConfig = {
  additionalSetup: [],
  port: hosts.api.port
};

// Tie all together
const dependencies = { express, bodyParser, helmet };

// Bootstrap application
const server = require('../common_modules/bootstrapper')(
    additionalConfig, middlewares, routes, errorHandler, dependencies);

gracefulShutdown(function() {
  console.log('Shutting http server down');
  server.close();
});
