const express = require('express');
const app = express();
const getport = require('getport');
const request = require('request-promise');
const expect = require('chai').expect;

const http = require('http');
let APP_URL;
const APP_SERVER = http.Server(app);

// Fake database client
const databaseClient = {
  queuePush: function() {
    return Promise.resolve('hello');
  },
  queueRemove: function() {
    return Promise.resolve({ message: 'OK' });
  },
  queueList: function() {
    return Promise.resolve([1, 2, 3]);
  },
  newsList: function() {
    return Promise.resolve([1, 2, 3]);
  },
  newsGetSet: function() {
    return Promise.resolve([1, 2, 3]);
  },
  pageGetVersion: function() {
    return Promise.resolve('whatever');
  },
  pageGetLatest: function() {
    return Promise.resolve('hhha');
  }
};

// Fake scrapper client
const scrapperClient = {
  launch: function() {
    return Promise.resolve({ message: 'OK' });
  }
};

const diffAnalyzer = function() {
  return 'Hello world';
};

const addUrlRoute = require('../api/routes/add-url')(databaseClient);
const deleteUrlRoute = require('../api/routes/delete-url')(databaseClient);
const listUrlRoute = require('../api/routes/list-url')(databaseClient);
const launchScrapperRoute = require('../api/routes/launch-scrapper')(scrapperClient);
const newsAllRoute = require('../api/routes/news-all')(databaseClient);
const newsGetSetRoute = require('../api/routes/news-get-set')(databaseClient);
const pageCompareVersionRoute = require('../api/routes/page-compare-versions')(
  databaseClient, diffAnalyzer);
const pageLatestRoute = require('../api/routes/page-latest')(databaseClient);
const pageVersionRoute = require('../api/routes/page-version')(databaseClient);

before(function(done) {
  getport(10000, 20000, function(e, port) {
    if (e) return console.error(e);

    APP_URL = `http://localhost:${port}/`;
    APP_SERVER.listen(port, function() {
      // Init routes
      addUrlRoute(app);
      deleteUrlRoute(app);
      listUrlRoute(app);
      launchScrapperRoute(app);
      newsAllRoute(app);
      newsGetSetRoute(app);
      pageCompareVersionRoute(app);
      pageLatestRoute(app);
      pageVersionRoute(app);

      done();
    });
  });
});

describe('API-routes', function() {
  describe('routes', function() {
    it('should post /uri/:uri', async function() {
      const link = encodeURIComponent('http://google.com.ua');

      const url = `${APP_URL}uri/${link}`;
      const response = await request.post(url);
      expect(response).to.be.equal('hello');
    });

    it('should delete /uri/:id', async function() {
      const url = `${APP_URL}uri/5888a5679e68f9255ca4fc0f`; // <- hardcoded id only to pass validation
      const response = await request.delete(url, { json: true });
      expect(response.message).to.be.equal('OK');
    });

    it('should get /uri/all', async function() {
      const url = `${APP_URL}uri/all`;
      const response = await request.get(url,{ json: true });
      const [a, b, c] = response;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(3);

    });

    it('should get /scrapper/launch', async function() {
      const url = `${APP_URL}scrapper/launch`;
      const response = await request.get(url,{ json: true });
      expect(response.message).to.be.equal('OK');
    });

    it('should get /news/all', async function() {
      const url = `${APP_URL}news/all`;
      const response = await request.get(url,{ json: true });
      const [a, b, c] = response;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(3);
    });

    it('should get /news/set/failed', async function() {
      const url = `${APP_URL}news/set/failed`;
      const response = await request.get(url,{ json: true });
      const [a, b, c] = response;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(3);
    });

    it('should get /news/set/changed', async function() {
      const url = `${APP_URL}news/set/changed`;
      const response = await request.get(url,{ json: true });
      const [a, b, c] = response;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(3);
    });

    it('should get /news/set/static', async function() {
      const url = `${APP_URL}news/set/static`;
      const response = await request.get(url,{ json: true });
      const [a, b, c] = response;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(3);
    });

    it('should get /page/:uri/diff/json/:versiona/:versionb', async function() {
      const uri = encodeURIComponent('http://google.com');

      const url = `${APP_URL}page/${uri}/diff/json/1/2`;
      const response = await request.get(url,{ json: true });

      expect(response).to.be.equal('Hello world');
    });

    it('should get /page/:uri/diff/html/:versiona/:versionb', async function() {
      const uri = encodeURIComponent('http://google.com');

      const url = `${APP_URL}page/${uri}/diff/html/1/2`;
      const response = await request.get(url,{ json: true });

      expect(response).to.be.equal('Hello world');
    });

    it('should get /page/latest/:uri', async function() {
      const uri = encodeURIComponent('http://google.com');

      const url = `${APP_URL}page/latest/${uri}`;
      const response = await request.get(url,{ json: true });

      expect(response).to.be.equal('hhha');
    });

    it('should get /page/:uri/version/:version', async function() {
      const uri = encodeURIComponent('http://google.com');

      const url = `${APP_URL}page/${uri}/version/1`;
      const response = await request.get(url,{ json: true });

      expect(response).to.be.equal('whatever');
    });
  });
});


after(function(done) {
  APP_SERVER.close(function() {
    done();
  });
});