var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID : Number,
    username : String,
    password : String,
    firstName : String,
    lastName : String,
    emailAddress : String,
    dOB : String,
}, {collection : 'Users'});

const User = mongoose.model('user', userSchema);
module.exports = User;