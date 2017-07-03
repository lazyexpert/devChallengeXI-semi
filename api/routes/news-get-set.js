module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {get} /news/set/:set
     * @apiName GetNewsSet
     * @apiGroup PublicAPI
     *
     * @apiDescription this route is to get specific type of the news
     *
     * @apiSuccess {Array} array of full entities of the news
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/news/set/:type', async function(req, res, next) {
      const type = req.params.type;

      if (type !== 'changed' && type !== 'failed' && type !== 'static')
        return res.send({ message: 'Invalid type' });

      try {
        return res.send(await databaseClient.newsGetSet(type));
      } catch (e) {
        return next(e);
      }
    });
  };
};
