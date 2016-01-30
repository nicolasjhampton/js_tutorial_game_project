// User Schema and model
var mongoose = require('mongoose');

var bcrypt = require('bcrypt');

var password_hash = function(string) {
    bcrypt.hash(string, 8, function(err, hash){
        if(err){
            return err;
        } else {
            return hash;
        }
    });
}

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String, set: password_hash},
    joined_at: {type: Date, default: Date.now}
});

var User = mongoose.model('Users', userSchema);

module.exports = User;