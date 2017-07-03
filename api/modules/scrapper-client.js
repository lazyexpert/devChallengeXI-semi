const request = require('request-promise');

module.exports = function(url, interserviceToken) {
  const headers = {
    Authorization: interserviceToken
  };

  return {
    launch: function() {
      return request.get({
        headers,
        url: `${url}launch`,
        json: true
      });
    }
  };
};