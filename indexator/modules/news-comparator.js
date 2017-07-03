const request = require('request-promise');

module.exports = function(databaseClient){
  return async function(news, updateObj) {
    const html = await request.get({ url: news.url });
    const latestVersion = await databaseClient.pageGetLatest(news.url);

    news.totalIndex++;
    updateObj.totalIndex = true;

    if (!latestVersion || html !== latestVersion.html) {
      updateObj.totalChanged = true;
      news.totalChanged++;
      await databaseClient.pageAdd(html, news.url);
    }
  };
};