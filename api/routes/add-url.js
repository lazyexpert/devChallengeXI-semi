const urlRegex = require('url-regex');

module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {post} /uri/:uri
     * @apiName AddURL
     * @apiGroup PublicAPI
     *
     * @apiDescription route to add url manually to parsing queue
     *
     * @apiParam url the url of the page to be added to index
     *
     * @apiSuccess {String} id of the added object notification of the success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.post('/uri/:uri', async function(req, res, next) {
      const uri = decodeURIComponent(req.params.uri);

      if (urlRegex({exact: true}).test(uri)) {
        try {
          const data = await databaseClient.queuePush(uri);
          return res.send(data);
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new Error('param uri doesn\'t exist or is not valid'));
      }
    });
  };
};