module.exports = function(newsModel) {
  return function(app) {
    /**
     * @api {get} /news/all
     * @apiName NewsAll
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route is to get all the news from database
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Array} array of full entities of the news
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/news/all', async function(req, res, next) {
      try {
        await newsModel(async function(News) {
          res.send(await News.find());
        });
      } catch (e) {
        next(e);
      }
    });
  };
};
