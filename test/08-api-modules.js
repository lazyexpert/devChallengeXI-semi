const expect = require('chai').expect;
const getport = require('getport');
const diff = require('diff');

const diffAnalyzer = require('../api/modules/diff-analyzer')();

const express = require('express');
const app = express();

const counters = {
  token: 'sdlvslkns',
  authorizationDetected: 0,
  launched: 0
};

const http = require('http');
const APP_SERVER = http.Server(app);
let scrapperClient;

app.get('/launch', function(req, res) {
  if (req.headers.authorization === this.token) {
    this.authorizationDetected++;
  }
  this.launched++;
  res.end();
}.bind(counters));

before(function(done) {
  getport(10000, 20000, function(e, port) {
    if (e) return console.error(e);

    const scrapperUri = `http://localhost:${port}/`;
    scrapperClient = require('../api/modules/scrapper-client')(scrapperUri, counters.token);

    APP_SERVER.listen(port, function() {
      done();
    });
  });
});

describe('API-modules', function() {
  describe('scrapper-client', function() {
    it('should launch scrapper', async function() {
      await scrapperClient.launch();
      expect(counters.launched).to.be.equal(1);
      expect(counters.authorizationDetected).to.be.equal(1);
    });
  });

  describe('diff-analyzer', function() {
    it('should analyze the same way as diff-module', function() {
      const objA = {
        html:'hello. world',
        createdAt: new Date().toISOString()
      };
      const objB = {
        html: 'don\'t hello. world',
        createdAt: new Date(Date.now() + 100).toISOString()
      };
      const correctDiff = diff.diffSentences(objA.html, objB.html);

      const res = diffAnalyzer('json', objA, objB);
      expect(JSON.stringify(correctDiff)).to.be.equal(JSON.stringify(res));
    });

    it('should analyze the same way as diff-module even if passed backwards', function() {
      const objA = {
        html:'hello. world',
        createdAt: new Date().toISOString()
      };
      const objB = {
        html: 'don\'t hello. world',
        createdAt: new Date(Date.now() + 100).toISOString()
      };
      const correctDiff = diff.diffSentences(objA.html, objB.html);

      const res = diffAnalyzer('json', objB, objA);
      expect(JSON.stringify(correctDiff)).to.be.equal(JSON.stringify(res));
    });
  });
});


after(function(done) {
  APP_SERVER.close(function() {
    done();
  });
});