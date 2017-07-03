module.exports = function(databaseClient, updateCalculator) {
  return async function(news, updateObj) {
    if (news) {
      const updatePlan = updateCalculator(news);
      const body = {
        updatePlan,
        totalIndex: updateObj.totalIndex,
        totalChanged: updateObj.totalChanged,
        totalFailed: updateObj.totalFailed
      };
      await databaseClient.newsUpdate(body, news.url);
    }
  };
};