const urlRegex = require('url-regex');

module.exports = function(pageModel) {
  return function(app) {
    /**
     * @api {get} /page/latest/:url
     * @apiName PageGet
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route is used to get the latest version of the page in the database
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Object} page instance
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/page/latest/:url', async function(req, res, next) {
      const url = req.params.url;
      if (urlRegex({exact: true}).test(url)) {
        try {
          const result = await pageModel(async function(Page) {
            const page = await Page.findOne({ url }).sort('-version');
            return page;
          });
          res.send(result);
        } catch (e) {
          next(e);
        }
      } else {
        next(new Error('Invalid url param'));
      }
    });
  };
};
