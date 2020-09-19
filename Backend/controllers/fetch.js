const User = require('../models/dbschema/user');
const errorController = require('./error');

exports.getAll = async (req, res, next) => {
    var userlist;
    await User.find().then(function(users){
        userlist = users;   
    }).catch(next);
    return userlist;
};

exports.getOne = async (req,res,next) => {
    
    user = await this.userfromUsername(req.body.username);

    if(user==null){
        errorController.error(res,"user not found",400);
    } else {
        res.send(user);
    }
}

// Returns user file if username exists, returns null if user doesn't exists
exports.userfromUsername = async(test_username) =>{
    var target_user;
    await User.findOne({username : test_username}).then(function(user){
        target_user = user;
    });
    return target_user;
}

exports.userfromEmail = async(email) =>{
    var target_user;
    await User.findOne({emailAddress : email}).then(function(user){
        target_user = user;
    });
    return target_user;
}

exports.userfromUserID = async(test_userID) =>{
    var target_user;
    await User.findOne({userID : test_userID}).then(function(user){
        target_user = user;
    });
    return target_user;
}

exports.usernameExists = async (username) =>{
    user_check = await this.userfromUsername(username);
    if(user_check != null){
        return true;
    } else{
        console.log("returning false");
        return false;
    }
}

exports.emailExists = async (email) =>{
    email_check = await this.userfromEmail(email);

    if(email_check != null){
        return true;
    } else{
        console.log("email check is false");
        return false;
    }
}