module.exports = function(queueModel) {
  return function(app) {
    /**
     * @api {get} /queue/all
     * @apiName QueueList
     * @apiGroup DatabaseLayer
     *
     * @apiDescription route to get all queue items
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Array} return list of queue items
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/queue/all', async function(req, res, next) {
      try {
        const result = await queueModel(async function(QueueItems) {
          const items = await QueueItems.find({executedAt: {$exists: false}});
          return items;
        });
        return res.send(result);
      } catch (e) {
        next(e);
      }
    });
  };
};
