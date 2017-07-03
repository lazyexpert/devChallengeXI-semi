const urlRegex = require('url-regex');

module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {get} /page/:uri/version/:version
     * @apiName PageGetVersion
     * @apiGroup PublicAPI
     *
     * @apiDescription this route is to get the specific vesion of the page
     *
     * @apiSuccess {Object} the page entity
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/page/:uri/version/:version', async function(req, res, next) {
      const uri = req.params.uri;
      const version = req.params.version;

      if (urlRegex({exact: true}).test(uri)) {
        try {
          return res.send(await databaseClient.pageGetVersion(uri, version));
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new Error('param uri doesn\'t exist or is not valid'));
      }
    });
  };
};
