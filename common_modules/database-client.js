/**
 * request - dependency, npm package 'request-promise'
 */
module.exports = function(interserviceToken, uri, request) {
  const headers = {
    Authorization: interserviceToken
  };

  return {
    queuePush: function(url) {
      return request.post({
        headers,
        url: `${uri}queue/${encodeURIComponent(url)}`,
        json: true
      });
    },
    queueRemove: function(url) {
      return request.delete({
        headers,
        url: `${uri}queue/${encodeURIComponent(url)}`,
        json: true
      });
    },
    newsPop: function() {
      return request.get({
        headers,
        url: `${uri}news/pop`,
        json: true
      });
    },
    queueList: function() {
      return request.get({
        headers,
        url: `${uri}queue/all`,
        json: true
      });
    },
    newsUpsert: function(url) {
      return request.put({
        headers,
        url: `${uri}news/${encodeURIComponent(url)}`,
        json: true
      });
    },
    newsUpdate: function(body, url) {
      return request({
        method: 'PATCH',
        headers,
        body,
        url: `${uri}news/${encodeURIComponent(url)}`,
        json: true
      });
    },
    newsList: function() {
      return request.get({
        headers,
        url: `${uri}news/all`,
        json: true
      });
    },
    pageAdd: function(html, url) {
      return request.post({
        headers,
        body: { html },
        url: `${uri}page/${encodeURIComponent(url)}`,
        json: true
      });
    },
    pageGetLatest: function(url) {
      return request.get({
        headers,
        url: `${uri}page/latest/${encodeURIComponent(url)}`,
        json: true
      });
    },
    pageGetVersion: function(url, version) {
      return request.get({
        headers,
        url: `${uri}page/${encodeURIComponent(url)}/version/${version}`,
        json: true
      });
    },
    newsGetSet: function(type) {
      return request.get({
        headers,
        url: `${uri}news/set/${type}`,
        json: true
      });
    }
  };
};
