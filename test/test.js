var mongoose = require('mongoose');
var expect = require('chai').expect;

// Import the database config and connection
var db = require('../db');

// Import our models
var User = require('../models/user');

// Mock data entered at the start of each test
var mockData = {username:'username',
                email:'email@email.com', 
                password:'password'};
                
// Unique mock data not entered at the start of each test
var uniqueMockData = {username:'username1',
                      email:'email1@email.com', 
                      password:'password1'};
                
// function for clearing the database
function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    done();
}

// Function for copying objects
function copy(obj){
    return (JSON.parse(JSON.stringify(obj)));  
};

// Wrapper for all test assumption statements
function testWrap(done, func) {
    return function () {
        func.apply(this, arguments);
        return done();
    }
};
                
describe('UserModel', function(){ 
    
    beforeEach(function(done) {
        new User(mockData).save().then(done());
    });
    
    // Clear db after each test
    afterEach(clearDB);

     
    it("should return a user record", function(done){
        // Assumption
        var test = testWrap(done, function(user){
            expect(user.username).to.equal('username1');
        });

        // Process
        new User(uniqueMockData).save().then(test);
         
    });
    
    it("should enter the user record in the database", function(done){
        
        // Assumption
        var test = testWrap(done, function(user){
            expect(user.email).to.equal('email@email.com');
        });
        
        // Process
        User.findOne({ username: mockData.username }).exec().then(test);
    });
    
    it("Should return true that the user can be found and deleted", function(done){
        
        // Assumption
        var test = testWrap(done, function(count){
            expect(count).to.equal(0);
        });
        
        //Process
        User.findOneAndRemove({username: mockData.username}).exec().then(User.count().then(test));
        
    });
    
    it("should be able to be retrieved by email", function(done){
        
        // Assumption
        var test = testWrap(done, function(user){
            expect(user.username).to.equal('username');
        });
        
        // Process
        User.findOne({ email: mockData.email }).exec().then(test);
        
    });
    
    it("should not return the password in plain text", function(done){
        
        // Assumption
        var test = testWrap(done, function(user){
            expect(user.password).to.not.equal(mockData.password);
        });
        
        // Process
        User.findOne({ username: mockData.username }).exec().then(test);
        
    });
    
    it("should raise an error if a username is not unique", function(done){
       
       // Assumption
        var test = testWrap(done, function(err, user){
            expect(err.code).to.equal(11000);
        });
        
        var testData = copy(mockData);
        
        testData.email = 'unique@unique.com';

        new User(testData).save(test);
       
        
    });
    
    it("should raise an error if an email is not unique", function(done){
       
       // Assumption
        var test = testWrap(done, function(err, user){
            expect(err.code).to.equal(11000);
        });
        
        var testData = copy(mockData);
        
        testData.username = 'uniqueunique';
        
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a username is too short", function(done){
       
       // Assumption
        var test = testWrap(done, function(err, user){
            expect(err.name).to.equal('ValidationError');
        });
        
        var testData = copy(uniqueMockData);
        
        testData.username = 'uuu';
        
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a username is too long", function(done){
       
       // Assumption
        var test = testWrap(done, function(err, user){
            expect(err.name).to.equal('ValidationError');
        });
        
        var testData = copy(uniqueMockData);
        
        // 51 u's
        testData.username = 'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU';
        
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a password is too short", function(done){
       
       // Assumption
        var test = testWrap(done, function(err, user){
            expect(err.name).to.equal('ValidationError');
        });
        
        var testData = copy(uniqueMockData);
        
        testData.password = 'sixsix';
        
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a password is too long", function(done){
       
       // Assumption
        var test = testWrap(done, function(err, user){
            console.log(err.name);
            expect(err.name).to.equal('ValidationError');
        });
        
        var testData = copy(uniqueMockData);
        
        // 51 u's
        testData.password = 'UUUUUUUUUUUUUUUUUUUUU';
        
        new User(testData).save(test);
        
    });

});