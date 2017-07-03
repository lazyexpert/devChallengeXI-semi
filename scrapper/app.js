const hosts = require('../common_modules/hosts');
const config = require('./config');

const express = require('express');
const helmet = require('helmet');
const request = require('request-promise');

const interserviceToken = config.interserviceToken;
const databaseUri = `http://${hosts.database.host}:${hosts.database.port}/`;

const databaseClient = require('../common_modules/database-client')(interserviceToken, databaseUri, request);
const gracefulShutdown = require('../common_modules/graceful-shutdown')(process);

const parser = require('./modules/parser')();
const scrapper = require('./modules/scrapper')({
  urls: config.urls,
  limit: config.limit,
  delay: config.delayInMs
}, parser, databaseClient);

// Middlewares
const errorHandler = require('../common_modules/error-handler')();
const httpLogger = require('../common_modules/http-log')();
const authorization = require('../common_modules/interservice')(interserviceToken);

const middlewares = [ authorization, httpLogger];

// Routes
const launchRoute = require('./routes/launch')(scrapper);

const routes = [launchRoute];

const additionalConfig = {
  additionalSetup: [],
  port: hosts.scrapper.port
};

// Tie all together
const dependencies = { express, helmet };

// Bootstrap application
const server = require('../common_modules/bootstrapper')(
    additionalConfig, middlewares, routes, errorHandler, dependencies);

gracefulShutdown(function() {
  console.log('Shutting the server down');
  server.close();
});