module.exports = function(databaseClient) {
  return async function() {
    const list = await databaseClient.queueList();

    for(const item of list) {
      await databaseClient.newsUpsert(item.url);
      await databaseClient.queueRemove(item._id);
    }

    if (list.length) console.log('No more items left in queue');
  };
};
