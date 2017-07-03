const sleep = require('../../common_modules/sleep')();

module.exports = function(databaseClient, newsUpdater, newsComparator, queueManager, indexDelay) {
  return async function() {
    try {
      // First - check items in queue
      await queueManager();

      /**
       * Loop through all jobs, that fit criteria
       * Intentionally get one by one, to handle case with multiple instances of indexator running
       */
      for(;;) {
        await sleep(indexDelay);

        const news = await databaseClient.newsPop();
        const updateObj = {};

        if (!news) {
          console.log('No more fitting news to index currently');
          break;
        } else {
          try {
            console.log(`Starting to index page: ${ news.url }`);
            await newsComparator(news, updateObj);
          } catch (e) {
            console.error(`Got problems while parsing url: ${news.url}. Accident saved to db.`);
            news.totalIndex++;
            news.totalFailed++;
            updateObj.totalIndex = true;
            updateObj.totalFailed = true;
          } finally {
            await newsUpdater(news, updateObj);
          }
        }
      }
    } catch(e) {
      console.error(e);
    }
  };
};