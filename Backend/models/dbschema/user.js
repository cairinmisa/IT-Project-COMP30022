var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID : {type : Date, required : true},
    username : {type : String, required : true},
    password : String,
    firstName : String,
    lastName : String,
    emailAddress : String,
    dOB : {type : Date, required: true},
}, {collection : 'Users'});

const User = mongoose.model('user', userSchema);
module.exports = User;