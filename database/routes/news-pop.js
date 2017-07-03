module.exports = function(newsModel) {
  return function(app) {
    /**
     * @api {get} /news/pop
     * @apiName NewsPop
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route is used by indexator. Get 1 instance of the pending in queue item to index.
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {String} the news instance
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/news/pop', async function(req, res, next) {
      try {
        const news = await newsModel(async function(News) {
          const item = await News.findOne({
            updatePlan: { $lt: new Date()},
            processing: false
          });
          if (item){
            item.processing = true;
            await item.save();
          }
          return item;
        });
        res.send(news);
      } catch (e) {
        next(e);
      }
    });
  };
};
