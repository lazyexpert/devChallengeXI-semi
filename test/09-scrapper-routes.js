const express = require('express');
const app = express();
const getport = require('getport');
const request = require('request-promise');
const expect = require('chai').expect;

const http = require('http');
let APP_URL;
const APP_SERVER = http.Server(app);

// Fake scrapper module
const scrapper = function() {
  return Promise.resolve('lol');
};

const launchRoute = require('../scrapper/routes/launch')(scrapper);

before(function(done) {
  getport(10000, 20000, function(e, port) {
    if (e) return console.error(e);

    APP_URL = `http://localhost:${port}/`;
    APP_SERVER.listen(port, function() {
      // Init routes
      launchRoute(app);

      done();
    });
  });
});

describe('Scrapper-routes', function() {
  describe('routes', function() {
    it('should get /launch', async function() {
      const url = `${APP_URL}launch`;
      const response = await request.get({
        url,
        json: true
      });
      expect(response.message).to.be.equal('OK');
    });
  });
});


after(function(done) {
  APP_SERVER.close(function() {
    done();
  });
});