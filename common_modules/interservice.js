module.exports = function(interserviceToken) {
  if (!interserviceToken) throw new Error('Interservice token is required');

  return function(req, res, next) {
    if (req.headers.authorization === interserviceToken) {
      return next();
    } else {
      throw new Error('Not authorized');
    }
  };
};