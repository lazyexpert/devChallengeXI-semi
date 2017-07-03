const expect = require('chai').expect;

const token = 'babsp9fspofhsdklns';

const interservice = require('../common_modules/interservice')(token);

describe('Common modules', function() {
  describe('Interservice middleware', function() {
    it('should pass with correct token', function(done) {
      const next = function() {
        done();
      };
      const req = {
        headers: {
          authorization: token
        }
      };
      const res = {};

      interservice(req, res, next);
    });

    it('shouldn\'t pass with incorrect token', function() {
      const next = function() {};
      const req = {
        headers: {
          token: 's098h34jntp3'
        }
      };
      const res = {};

      try {
        interservice(req, res, next);
      } catch(e) {
        expect(e.message).to.be.equal('Not authorized');
      }
    });

    it('shouldn\'t pass without token', function() {
      const next = function() {};
      const req = {
        headers: {}
      };
      const res = {};

      try {
        interservice(req, res, next);
      } catch(e) {
        expect(e.message).to.be.equal('Not authorized');
      }
    });
  });
});
