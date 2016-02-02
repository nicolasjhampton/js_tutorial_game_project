/*
 *  Server Tests
 */

var mongoose = require('mongoose');
var expect = require('chai').expect;
var request = require('supertest');
var server;

// Wrapper for all test assumption statements
function testWrap(done, func) {
    return function () {
        func.apply(this, arguments);
        return done();
    }
};


describe("server", function(){
    
    before(function() {
       //server = require('../app');
    });

    
    // Pulled from https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
    beforeEach(function () {
        if(!server) {
            delete require.cache[require.resolve('../app')];
            server = require('../app');
        }
    });
    
    afterEach(function (done) {
        server.listen().close(done);
    });
    
    it("should correctly display the register page", function(done) {
        
        request(server).get('/register')
            .expect(200, done);
            // .expect('username')
            // .expect('email')
            // .expect('password')
            // .expect('confirm password', done);        
    });
    
    it("should correctly display the login page", function(done) {
        
        request(server).get('/login')
            .expect(200, done);
            // .expect('username')
            // .expect('password')
      
    });
    
    it("should correctly display the logout page", function(done) {
        
        request(server).get('/logout')
            .expect(302, done);
                 
    });
    
});