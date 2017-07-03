const expect = require('chai').expect;

const counters = {
  executed: 0
};

const job = function() {
  this.executed++;
}.bind(counters);

const scheduler = require('../common_modules/scheduler')(job, 10, true);

describe('Common modules', function() {
  describe('Scheduler', function() {
    it('should start job', function(done) {
      scheduler.start();
      setTimeout(function() {
        expect(counters.executed).to.be.equal(1);
        done();
      }, 15);
    });

    it('should stop job', function(done) {
      scheduler.stop();
      const current = counters.executed;
      setTimeout(function() {
        expect(counters.executed).to.be.equal(current);
        done();
      }, 15);
    });
  });
});