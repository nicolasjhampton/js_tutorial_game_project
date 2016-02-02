/*
 *  Model Tests
 */

var mongoose = require('mongoose');
var expect = require('chai').expect;


var db = require('../db');
var User = require('../models/user');


/*
 *  Helper Functions
 */

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


/*
 *  Mock Data 
 */

// Mock data entered at the start of each test
var mockData = {username:'username',
                email:'email@email.com', 
                password:'password'};
                
// Unique mock data not entered at the start of each test
var uniqueMockData = {username:'username1',
                      email:'email1@email.com', 
                      password:'password1'};


/*
 *  Test Suite 
 */
                
describe('UserModel', function(){ 
    
    
    // Clear entire database before all tests
    before(clearDB);
    
    // Enter mockData into database before each test
    beforeEach(function(done) {
        new User(mockData).save(done);
    });
    
    // Clear entire database after each test
    afterEach(clearDB);
     
     
    it("should return a user record", function(done){
        
        // Test
        var test = testWrap(done, function(err, user){
            if (err) throw Error(err);
            
            // Assumption
            expect(user.username).to.equal('username1');
        });

        // Process
        new User(uniqueMockData).save(test);
         
    });
    
    it("should enter the user record in the database", function(done){
        
        // Test
        var test = testWrap(done, function(err, user){
            if (err) throw Error(err);
            
            // Assumption
            expect(user.email).to.equal('email@email.com');
        });
        
        // Process
        User.findOne({ username: mockData.username }).exec(test);
        
    });
    
    it("Should return true that the user can be found and deleted", function(done){
        
        // Test
        var test = testWrap(done, function(err, count){
            if (err) throw Error(err);
            
            // Assumption
            expect(count).to.equal(0);
        });
        
        //Process
        var promise = User.findOneAndRemove({username: mockData.username});
        promise.then(function(removedUser){
           var secondPromise = User.count().exec(test);
           secondPromise.then(test);
        });
        
    });
    
    it("should be able to be retrieved by email", function(done){
        
        // Test
        var test = testWrap(done, function(err, user){
            if (err) throw Error(err);
            
            // Assumption
            expect(user.username).to.equal('username');
        });
        
        // Process
        User.findOne({email:mockData.email}).exec(test);
        
    });
    
    it("should not return the password in plain text", function(done){
        
        // Test
        var test = testWrap(done, function(err, user){
            if (err) throw Error(err);
            
            // Assumption
            expect(user.password).to.not.equal(mockData.password);
        });
        
        // Process
        User.findOne({ username: mockData.username }).exec(test);
        
    });
    
    it("should raise an error if a username is not unique", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if(user) console.log(user);
            
            // Assumption
            expect(err.code).to.equal(11000);
        });
        
        // Setup
        var testData = copy(mockData);
        testData.email = 'unique@unique.com';
        
        // Process
        new User(testData).save(test);
       
    });
    
    it("should raise an error if an email is not unique", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if(user) console.log(user);
            
            // Assumption
            expect(err.code).to.equal(11000);
        });
        
        // Setup
        var testData = copy(mockData);
        testData.username = 'uniqueunique';
        
        // Process
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a username is too short", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if(user) console.log(user);
            
            // Assumption
            expect(err.name).to.equal('ValidationError');
        });
        
        // Setup
        var testData = copy(uniqueMockData);
        testData.username = 'uuu';
        
        // Process
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a username is too long", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if(user) console.log(user);
            
            // Assumption
            expect(err.name).to.equal('ValidationError');
        });
        
        // Setup
        var testData = copy(uniqueMockData);
        testData.username = 'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU';
        
        // Process
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a password is too short", function(done){
       
        // Test
        var test = testWrap(done, function(err, user){
            if(user) console.log(user);
            
            // Assumption
            expect(err.name).to.equal("ValidationError");
        });
        
        // Setup
        var testData = copy(uniqueMockData);
        testData.password = 'sixsix';
        
        // Process
        new User(testData).save(test);
        
    });
    
    it("should raise an error if a password is too long", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if(user) console.log(user);
            
            // Assumption
            expect(err.name).to.equal("ValidationError");
        });
        
        // Setup
        var testData = copy(uniqueMockData);
        testData.password = 'UUUUUUUUUUUUUUUUUUUUU';
        
        // Process
        new User(testData).save(test);
        
    });
    
    it("should have a method to check the password hash", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if (err) throw Error(err);
            
            // Assumption
            expect(user.check_hash(mockData.password)).to.equal(true);
        });

        // Process
        User.findOne({username: mockData.username}).exec(test);
        
    });
    
    it("should have a method to check the password hash " + 
        "that fails with an incorrect password", function(done){
       
       // Test
        var test = testWrap(done, function(err, user){
            if (err) throw Error(err);
            
            // Assumption
            expect(user.check_hash('incorrectPassword')).to.equal(false);
        });

        // Process
        User.findOne({username: mockData.username}).exec(test);
        
    });

});