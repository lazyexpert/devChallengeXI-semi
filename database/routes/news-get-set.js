module.exports = function(newsModel) {
  return function(app) {
    /**
     * @api {get} /news/set/:type
     * @apiName NewsPop
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route is used to get specific set of news
     *
     * @apiParam {String} type of the set, can be 'changed', 'static' and 'failed'
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {String} the news instance
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/news/set/:type', async function(req, res, next) {
      const type = req.params.type;

      if (type !== 'changed' && type !== 'failed' && type !== 'static')
        return res.send({ message: 'Invalid type' });

      try {
        const query = {};

        if (type === 'changed') query.totalChanged = { $gt: 1 };
        else if (type === 'failed') query.totalFailed = { $gt: 1 };
        else query.totalChanged = 1;

        await newsModel(async function(News) {
          res.send(await News.find(query));
        });
      } catch (e) {
        next(e);
      }
    });
  };
};
