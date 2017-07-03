module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {get} /uri/all
     * @apiName ListURL
     * @apiGroup PublicAPI
     *
     * @apiDescription route to list all urls in queue that are not processing and not yet executed
     *
     * @apiSuccess {Array} list of items
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/uri/all', async function(req, res, next) {
      try {
        const data = await databaseClient.queueList();
        return res.send(data);
      } catch (e) {
        return next(e);
      }
    });
  };
};