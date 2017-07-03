const urlRegex = require('url-regex');

module.exports = function(newsModel) {
  return function(app) {
    /**
     * @api {put} /queue/all
     * @apiName QueueList
     * @apiGroup DatabaseLayer
     *
     * @apiDescription route insert new record if the news with this url doesn't exists yet.
     * If the record is found - current date will be set to field 'updated'
     *
     * @apiParam {String} url the link of the page with news
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Object} notification of success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.put('/news/:url', async function(req, res, next) {
      const url = decodeURIComponent(req.params.url);

      if (urlRegex({exact: true}).test(url)) {
        try {
          await newsModel(async function(News) {
            const items = await News.find({url});
            if (!items.length) {
              const news = new News({url});
              await news.save();
            } else {
              items[0].updatedAt = new Date();
              await items[0].save();
            }
          });
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
