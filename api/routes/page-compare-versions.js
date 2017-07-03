const urlRegex = require('url-regex');

module.exports = function(databaseClient, diffAnalyzer) {
  return function(app) {
    /**
     * @api {get} /page/:uri/diff/:type/:versiona/:versionb
     * @apiName PageGetVersion
     * @apiGroup PublicAPI
     *
     * @apiDescription this route is to compare
     *
     * @apiSuccess {Object} if type is json - you receive array of difference objects
     * if type is html - you receive an html markdown with changes
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/page/:uri/diff/:type/:versiona/:versionb', async function(req, res, next) {
      const uri = req.params.uri;
      const versionA = req.params.versiona;
      const versionB = req.params.versionb;
      const type = req.params.type;

      if (type !== 'json' && type !== 'html') return next(new Error('Invalid type'));

      if (urlRegex({exact: true}).test(uri)) {
        try {
          const pageA = await databaseClient.pageGetVersion(uri, versionA);
          const pageB = await databaseClient.pageGetVersion(uri, versionB);
          if (!pageA || !pageB) return res.send({ message: 'Incorrect page versions'});

          const result = diffAnalyzer(type, pageA, pageB);
          return res.send(result);
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new Error('param uri doesn\'t exist or is not valid'));
      }
    });
  };
};
