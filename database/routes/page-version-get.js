const urlRegex = require('url-regex');

module.exports = function(pageModel) {
  return function(app) {
    /**
     * @api {get} /page/:url/version/:version
     * @apiName PageVersionGet
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route is used to get the specific version of the page
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Object} page instance
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/page/:url/version/:version', async function(req, res, next) {
      const url = req.params.url;
      const version = req.params.version | 0;

      if (urlRegex({exact: true}).test(url)) {
        try {
          await pageModel(async function(Page) {
            res.send(await Page.findOne({ url, version }));
          });
        } catch (e) {
          next(e);
        }
      } else {
        next(new Error('Invalid url param'));
      }
    });
  };
};
