const urlRegex = require('url-regex');

module.exports = function(queueModel, newsModel) {
  return function(app) {
    /**
     * @api {post} /queue/:url
     * @apiName InsertUrlToQueue
     * @apiGroup DatabaseLayer
     *
     * @apiDescription insert new item in the queue in case if it is not in news collection
     *
     * @apiParam {String} url page to be marked as executed
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Object} notification of the success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.post('/queue/:url', async function(req, res, next) {
      const url = decodeURIComponent(req.params.url);

      if (urlRegex({exact: true}).test(url)) {
        try {
          const exists = await newsModel(async function(News) {
            return await News.findOne({ url });
          });

          if (!exists) {
            await queueModel(async function(QueueItems) {
              const queueItem = new QueueItems({ url });
              await queueItem.save();
            });
          }
          return res.send({ message: 'OK' });
        } catch (e) {
          next(e);
        }
      } else {
        next(new Error('Invalid url param'));
      }
    });
  };
};
