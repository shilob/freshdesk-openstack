var request = require('supertest');
var config = require('../../configLoader');
var version = config.apiVersion;

describe('InstanceController', function() {
  var addInfoUrl = '/osid/api/' + version + '/instance/addInfo';
  
  describe('#addInfo() - ' + addInfoUrl + ' - No authentication, ', function() {
    it('should return 403', function (done) {
      request(sails.hooks.http.app)
        .post(addInfoUrl)
        .expect(403, 'You are not permitted to perform this action.', done);
    });
  });
  
  describe('#addInfo() - ' + addInfoUrl + ' - With authentication, no parameters, ', function() {
    it('should return 400', function (done) {
      request(sails.hooks.http.app)
        .post(addInfoUrl)
        .set('Authorization', config.authorization)
        .send({})
        .expect(400, 'Missing parameters.', done);
    });
  });
  
  describe('#addInfo() - ' + addInfoUrl + ' - With authentication, with no IP address, ', function() {
    it('should return 200, with foundMatch == false', function (done) {
      request(sails.hooks.http.app)
        .post(addInfoUrl)
        .set('Authorization', config.authorization)
        .send({srcText: '', ticketId:'18'})
        .expect(200, {foundMatch:false}, done);
    });
  });
  
  describe('#addInfo() - ' + addInfoUrl + ' - With authentication, with multiple addresses, ', function() {
    it('should return 200, with mocked instance data.', function (done) {
      request(sails.hooks.http.app)
        .post(addInfoUrl)
        .set('Authorization', config.authorization)
        .send({srcText: 'IP1: 192.168.0.1, INvalid IP: 0.0.0, IP2: 192.168.0.2, Duplicate IP: 192.168.0.2', ticketId:'18'})
        .expect(function(res) {
          if (res.body.foundMatch === false) {
            return "Didn't find anything!";
          }
          console.log(res.body);
        })
        .end(done);
    });
  });

});