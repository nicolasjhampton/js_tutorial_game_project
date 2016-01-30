// User Schema and model
var mongoose = require('mongoose');

var bcrypt = require('bcrypt');

var password_hash = function(password) {
    // Test for length
    if(password.length < 7 || password.length > 20) {
        // Throw error
        throw new Exception("Invalid Password Length") 
    } else {
        // Hash password
        bcrypt.hash(password, 8, function(err, hash){
            if(err){
                return err;
            } else {
                return hash;
            }
        });
    }
};

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, minlength: 4, maxlength: 50},
    email: {type: String, unique: true},
    password: {type: String, set: password_hash},
    joined_at: {type: Date, default: Date.now}
});

var User = mongoose.model('Users', userSchema);

module.exports = User;