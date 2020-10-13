const User = require('../models/dbschema/user');
const Eportfolio = require('../models/dbschema/eportfolio');
const Template = require('../models/dbschema/templates');
const errorController = require('./error');

exports.getAllUsers = async (req, res, next) => {
    var userlist;
    await User.find().then(function(users){
        userlist = users;   
    }).catch(next);
    return userlist;
};

exports.getAllEports = async (req, res, next) => {
    var eportList;
    await Eportfolio.find().then(function(users){
        eportList = users;   
    }).catch(next);
    return eportList;
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

exports.eportfromEportID = async(test_eportID) =>{
    var target_eport;
    await Eportfolio.findOne({eportID : test_eportID}).then(function(user){
        target_eport = user;
    });
    return target_eport;
}

exports.tempfromTempID = async(test_tempID) =>{
    var target_temp;
    await Template.findOne({templateID : test_tempID}).then(function(temp){
        target_temp = temp;
    });
    return target_temp;
}

exports.userIDExists = async (userID) =>{
    user_check = await this.userfromUserID(userID);
    if(user_check != null){
        return true;
    } else{
        return false;
    }
}

exports.usernameExists = async (username) =>{
    user_check = await this.userfromUsername(username);
    if(user_check != null){
        return true;
    } else{
        return false;
    }
}


exports.emailExists = async (email) =>{
    email_check = await this.userfromEmail(email);

    if(email_check != null){
        return true;
    } else{
        return false;
    }
}

exports.eportExists = async (eportID) =>{
    eport_check = await this.eportfromEportID(eportID);
    if(eport_check != null){
        return true;
    } else{
        return false;
    }
}

exports.templateExists = async (templateID) =>{
    temp_check = await this.tempfromTempID(templateID);
    if(temp_check != null){
        return true;
    } else{
        return false;
    }
}