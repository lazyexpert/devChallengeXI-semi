const urlRegex = require('url-regex');

module.exports = function(pageModel) {
  return function(app) {
    /**
     * @api {post} /page/:url
     * @apiName PageAdd
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route is used to add new version of the page to the database
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiParam {String} url the link of the page with news
     * @apiParam {String} body the html of the parsed page
     *
     * @apiSuccess {Object} notification about success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.post('/page/:url', async function(req, res, next) {
      const url = req.params.url;

      if (urlRegex({exact: true}).test(url) && req.body.html && req.body.html.length) {
        try {
          await pageModel(async function(Page) {
            const page = await Page.findOne({ url }).sort('-version');
            const version = (page && page.version || 0) + 1;
            const newPage = new Page({
              url,
              version,
              html: req.body.html
            });
            await newPage.save();
          });
          res.send({ message: 'OK' });
        } catch (e) {
          next(e);
        }
      } else {
        next(new Error('Invalid url param or missing body'));
      }
    });
  };
};
