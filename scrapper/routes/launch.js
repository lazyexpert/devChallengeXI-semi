module.exports = function(scrapper) {
  return function(app) {

    /**
     * @api {get} /launch
     * @apiName Launch
     * @apiGroup ScrapperAPI
     *
     * @apiDescription route to launch scrapper manually
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Object} identifies about success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.get('/launch', async function(req, res, next) {
      try {
        await scrapper();
        res.send({ message: 'OK' });
      } catch (e) {
        next(e);
      }
    });
  };
};