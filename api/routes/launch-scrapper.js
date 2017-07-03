module.exports = function(scrapperClient) {
  return function(app) {
    /**
     * @api {get} /scrapper/launch
     * @apiName LaunchScrapper
     * @apiGroup PublicAPI
     *
     * @apiDescription route to launch scrapper manually
     *
     * @apiSuccess {Object} identifies about success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/scrapper/launch', async function(req, res, next) {
      try {
        const result = await scrapperClient.launch();
        return res.send(result);
      } catch (e) {
        return next(e);
      }
    });
  };
};