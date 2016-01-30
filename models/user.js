// User Schema and model
var mongoose = require('mongoose');

var DEFAULT_FIELD = { type: String, default: '' };

var userSchema = new mongoose.Schema({
    username: DEFAULT_FIELD,
    email: DEFAULT_FIELD,
    password: DEFAULT_FIELD,
    joined_at: {type: Date, default: Date.now}
});

var User = mongoose.model('Users', userSchema);

module.exports = User;