/*
 *  User: Schema, methods and model 
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, minlength: 4, maxlength: 50},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 7, maxlength: 20},
    joined_at: {type: Date, default: Date.now}
});


userSchema.pre('save', function(next) {
    
    var user = this;
    
    bcrypt.hash(user.password, 8, function(err, hash){
        
        if(err) return next(err);
        user.password = hash;
        next();

    });

});


// Check out this decorator function pattern I found
userSchema.methods.check_hash = function(possiblePassword) {
    
    return bcrypt.compareSync(possiblePassword, this.password);
    
};


var User = mongoose.model('Users', userSchema);

module.exports = User;