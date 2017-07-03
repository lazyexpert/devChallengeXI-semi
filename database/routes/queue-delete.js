const isValidObjectId = require('mongoose').Types.ObjectId.isValid;

module.exports = function(queueModel) {
  return function(app) {
    /**
     * @api {delete} /queue/:id
     * @apiName DeleteQueueModel
     * @apiGroup DatabaseLayer
     *
     * @apiDescription route removes item from queue
     *
     * @apiParam {String} id of the record to mark as executed
     *
     * @apiHeader {String} Authorization interservice token
     *
     * @apiSuccess {Object} notification of the success
     *
     * @apiError ServerError return 500 if any error occurs
     */
    app.delete('/queue/:id', async function(req, res, next) {
      if (isValidObjectId(req.params.id)) {
        try {
          const result = await queueModel(async function(QueueItems) {
            await QueueItems.remove({ _id: req.params.id });
            return { message: 'OK' };
          });
          return res.send(result);
        } catch (e) {
          next(e);
        }
      } else {
        next(new Error('Not valid objectId param'));
      }
    });
  };
};
