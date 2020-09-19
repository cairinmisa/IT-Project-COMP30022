var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
     userID : {type : String},
    username : {type : String},
    password : {type : String, required : true},
    firstName : String,
    lastName : String,
    emailAddress : String,
    dOB : {type : String},
    }, {collection : 'Users'});

const User = mongoose.model('user', userSchema);
module.exports = User;