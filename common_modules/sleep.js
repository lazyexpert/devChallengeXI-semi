/**
 * Sleep function
 *
 * Preferred usage:
 * await sleep(100);
 *
 */
module.exports = function() {
  return function sleep(ms) {
    return new Promise( resolve => setTimeout(resolve, ms|0));
  };
};
