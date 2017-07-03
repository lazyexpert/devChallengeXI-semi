module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {get} /news/all
     * @apiName NewsAll
     * @apiGroup PublicAPI
     *
     * @apiDescription this route is to get all the news from database
     *
     * @apiSuccess {Array} array of full entities of the news
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/news/all', async function(req, res, next) {
      try {
        return res.send(await databaseClient.newsList());
      } catch (e) {
        return next(e);
      }
    });
  };
};
