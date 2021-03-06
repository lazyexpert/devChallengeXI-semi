const urlRegex = require('url-regex');

module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {get} /page/latest/:uri
     * @apiName PageLatest
     * @apiGroup PublicAPI
     *
     * @apiDescription this route is to get the latest vesion of the page
     *
     * @apiSuccess {Object} the page entity
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/page/latest/:uri', async function(req, res, next) {
      const uri = req.params.uri;
      if (urlRegex({exact: true}).test(uri)) {
        try {
          return res.send(await databaseClient.pageGetLatest(uri));
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new Error('param uri doesn\'t exist or is not valid'));
      }
    });
  };
};
