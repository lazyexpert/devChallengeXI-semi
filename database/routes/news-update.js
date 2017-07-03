const urlRegex = require('url-regex');
const tv4 = require('tv4');

module.exports = function(newsModel) {
  const schema = {
    type: 'object',
    properties: {
      // ISO date string
      updatePlan: 'string',
      totalChanged: 'boolean',
      totalIndex: 'boolean',
      totalFailed: 'boolean'
    },
    required: ['updatePlan', 'totalIndex']
  };

  return function(app) {
    /**
     * @api {patch} /news/:url
     * @apiName NewsPatch
     * @apiGroup DatabaseLayer
     *
     * @apiDescription this route will update the 'updatePlan' of the news model.
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiParam {String} url of the news, that has to be updated
     *
     * @apiParam {String} body.updatePlan the new date to be set into updatePlan
     *
     * @apiSuccess {Object} notification about success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.patch('/news/:url', async function(req, res, next) {
      const url = decodeURIComponent(req.params.url);
      if (urlRegex({exact: true}).test(url) && tv4.validate(req.body, schema)) {
        try {
          await newsModel(async function(News) {
            const news = await News.findOne({url});
            news.updatePlan = req.body.updatePlan;

            if (req.body.totalIndex) news.totalIndex++;
            if (req.body.totalChanged) news.totalChanged++;
            if (req.body.totalFailed) news.totalFailed++;
            news.processing = false;
            await news.save();
          });
          return res.send({ message: 'OK' });
        } catch (e) {
          next(e);
        }
      } else {
        next(new Error(`Invalid url param: ${url} or req.body: ${JSON.stringify(req.body)}`));
      }
    });
  };
};
