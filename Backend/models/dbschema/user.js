var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID : {
        type : String,
        required : true
    }
})

const User = mongoose.model('user', userSchema);
module.exports = User;