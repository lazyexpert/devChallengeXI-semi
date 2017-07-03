const isValidObjectId = require('mongoose').Types.ObjectId.isValid;

module.exports = function(databaseClient) {
  return function(app) {
    /**
     * @api {delete} /uri/:id
     * @apiName DeleteURL
     * @apiGroup PublicAPI
     *
     * @apiDescription route to delete url manually from parsing queue
     *
     * @apiParam id the id of the record you want to remove from database
     *
     * @apiSuccess {Object} notification of the success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.delete('/uri/:id', async function(req, res, next) {

      if (isValidObjectId(req.params.id)) {
        try {
          const data = await databaseClient.queueRemove(req.params.id);
          return res.send(data);
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new Error('param id doesn\'t exist or is not valid'));
      }
    });
  };
};