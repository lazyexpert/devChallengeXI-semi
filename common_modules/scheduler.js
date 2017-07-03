module.exports = function(job, interval, silent) {
  return {
    start : function() {
      this.interval = setInterval(function() {
        if (!silent) console.log('Performing scheduled check');
        job();
      }, interval);
    },
    stop: function() {
      if (this.interval) {
        if (!silent) console.log('Stopping scheduler');
        clearInterval(this.interval);
      }
    }
  };
};