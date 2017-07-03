const expect = require('chai').expect;

const sleep = require('../common_modules/sleep')();

describe('Common modules', function() {
  describe('sleep', function() {
    it('should make a delay', async function() {
      const now = Date.now();
      await sleep(100);
      const finished = Date.now();
      const possibleDelay = 110;
      const delay = finished - now;
      const isNormalDelay = delay <= possibleDelay;
      expect(isNormalDelay).to.be.equal(true);
    });

    it('shouldn\'t fail if I pass garbage', async function() {
      try {
        await sleep('hello');
      } catch(e) {
        throw e;
      }
    });

    it('shouldn\'t make delay if I pass garbage', async function() {
      const now = Date.now();
      await sleep('hello');
      const finished = Date.now();
      const delay = finished - now;
      const possibleDelay = 10;
      const isNormalDelay = delay <= possibleDelay;
      expect(isNormalDelay).to.be.equal(true);
    });


  });
});