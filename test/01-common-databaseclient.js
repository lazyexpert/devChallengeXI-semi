const expect = require('chai').expect;
const request = require('request-promise');

const token = 'slfh3o7rshfb';

const counters = {
  token,
  authorizationDetected: 0,
  queuePush: 0,
  queueRemove: 0,
  newsPop: 0,
  queueList: 0,
  newsUpsert: 0,
  newsUpdate: 0,
  pageAdd: 0,
  pageGetLatest: 0,
  newsList: 0,
  pageGetVersion: 0,
  newsGetSet: 0
};

/**
 * Create fake app
 */
const express = require('express');
const port = 20000;
let server;

const uri = `http://localhost:${port}/`;
const databaseClient = require('../common_modules/database-client')(
  token, uri, request);

const app = express();

app.post('/queue/:url', function(req, res) {
  if (req.headers.authorization === this.token) {
    this.authorizationDetected++;
  }
  this.queuePush++;
  res.end();
}.bind(counters));

app.delete('/queue/:url', function(req, res) {
  this.queueRemove++;
  res.end();
}.bind(counters));

app.get('/news/pop', function(req, res) {
  this.newsPop++;
  res.end();
}.bind(counters));

app.get('/queue/all', function(req, res) {
  this.queueList++;
  res.end();
}.bind(counters));

app.patch('/news/:url', function(req, res) {
  this.newsUpdate++;
  res.end();
}.bind(counters));

app.put('/news/:url', function(req, res) {
  this.newsUpsert++;
  res.end();
}.bind(counters));

app.post('/page/:url', function(req, res) {
  this.pageAdd++;
  res.end();
}.bind(counters));

app.get('/page/latest/:url', function(req, res) {
  this.pageGetLatest++;
  res.end();
}.bind(counters));

app.get('/news/all', function(req, res) {
  this.newsList++;
  res.end();
}.bind(counters));

app.get('/page/:url/version/:version', function(req, res) {
  this.pageGetVersion++;
  res.end();
}.bind(counters));

app.get('/news/set/:set', function(req, res) {
  this.newsGetSet++;
  res.end();
}.bind(counters));

/**
 * Start tests
 */
before(function(done){
  server = this.listen(port, () => done());
}.bind(app));

describe('Common modules', function() {
  describe('Database client module', function() {
    it('should post /queue/:url', async function() {
      const url = encodeURIComponent('http://google.com');

      await databaseClient.queuePush(url);
      expect(counters.queuePush).to.be.equal(1);
      expect(counters.authorizationDetected).to.be.equal(1);
    });

    it('should delete /queue/:url', async function() {
      const url = encodeURIComponent('http://google.com');

      await databaseClient.queueRemove(url);
      expect(counters.queueRemove).to.be.equal(1);
    });

    it('should get /news/pop', async function() {
      await databaseClient.newsPop();
      expect(counters.newsPop).to.be.equal(1);
    });

    it('should get /queue/all', async function() {
      await databaseClient.queueList();
      expect(counters.queueList).to.be.equal(1);
    });

    it('should put /news/:url', async function() {
      const url = encodeURIComponent('http://google.com');

      await databaseClient.newsUpsert(url);
      expect(counters.newsUpsert).to.be.equal(1);
    });

    it('should patch /news/:url', async function() {
      const url = encodeURIComponent('http://google.com');

      await databaseClient.newsUpdate({}, url);
      expect(counters.newsUpdate).to.be.equal(1);
    });

    it('should post /page/:url', async function() {
      const url = encodeURIComponent('http://google.com');

      await databaseClient.pageAdd(url);
      expect(counters.pageAdd).to.be.equal(1);
    });

    it('should get /page/latest/:url', async function() {
      const url = encodeURIComponent('http://google.com');

      await databaseClient.pageGetLatest(url);
      expect(counters.pageGetLatest).to.be.equal(1);
    });

    it('should get /news/all', async function() {
      await databaseClient.newsList();
      expect(counters.newsList).to.be.equal(1);
    });

    it('should get /page/:url/version/:version', async function() {
      await databaseClient.pageGetVersion();
      expect(counters.pageGetVersion).to.be.equal(1);
    });

    it('should get /page/set/:set', async function() {
      await databaseClient.newsGetSet('changed');
      expect(counters.newsGetSet).to.be.equal(1);
    });
  });
});

after(function(done) {
  server.close(function() {
    done();
  });
});