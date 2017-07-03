module.exports = function(usualUpdateDelay, failedPenalty) {
  return function (news) {
    /**
     * Calcualte the change koeficient
     */
    const changeKoef = (news.totalChanged || 1) / (news.totalIndex || 1);

    /**
     * Calculate the penalty for failed attempts
     */
    const failedDelay = failedPenalty * news.totalFailed;

    /**
     * Calculate new update delay
     */
    const newUpdateDelay = usualUpdateDelay / changeKoef + failedDelay;

    /**
     * Calculate new Date from current + calculated delay
     */
    return new Date(Date.now() + newUpdateDelay).toISOString();
  };
};