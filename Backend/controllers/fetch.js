const User = require('../models/dbschema/user');
const Eportfolio = require('../models/dbschema/eportfolio');
const Template = require('../models/dbschema/templates');


// Returns a list of all users in the database
exports.getAllUsers = async (req, res, next) => {
    var userlist;
    await User.find().then(function(users){
        userlist = users;   
    }).catch(next);
    return userlist;
};

// Returns a list of all eports in the database
exports.getAllEports = async (req, res, next) => {
    var eportList;
    await Eportfolio.find().then(function(users){
        eportList = users;   
    }).catch(next);
    return eportList;
};


// Returns user file if username exists, returns null if user doesn't exists
exports.userfromUsername = async(test_username) =>{
    var target_user;
    await User.findOne({username : test_username}).then(function(user){
        target_user = user;
    });
    return target_user;
}

// Returns a user given an email
exports.userfromEmail = async(email) =>{
    var target_user;
    await User.findOne({emailAddress : email}).then(function(user){
        target_user = user;
    });
    return target_user;
}

// Returns a user given a userID
exports.userfromUserID = async(test_userID) =>{
    var target_user;
    await User.findOne({userID : test_userID}).then(function(user){
        target_user = user;
    });
    return target_user;
}

// Returns an eport given an eportID
exports.eportfromEportID = async(test_eportID) =>{
    var target_eport;
    await Eportfolio.findOne({eportID : test_eportID}).then(function(user){
        target_eport = user;
    });
    return target_eport;
}

// Returns a template given a templateiD
exports.tempfromTempID = async(test_tempID) =>{
    var target_temp;
    await Template.findOne({templateID : test_tempID}).then(function(temp){
        target_temp = temp;
    });
    return target_temp;
}

// Returns true if the userID exists in the database
exports.userIDExists = async (userID) =>{
    user_check = await this.userfromUserID(userID);
    if(user_check != null){
        return true;
    } else{
        return false;
    }
}

// Returns true if the username exists in the database
exports.usernameExists = async (username) =>{
    user_check = await this.userfromUsername(username);
    if(user_check != null){
        return true;
    } else{
        return false;
    }
}

// Returns true if the email exists in the database
exports.emailExists = async (email) =>{
    email_check = await this.userfromEmail(email);

    if(email_check != null){
        return true;
    } else{
        return false;
    }
}

// Returns true if the eportfolio exists in the database
exports.eportExists = async (eportID) =>{
    eport_check = await this.eportfromEportID(eportID);
    if(eport_check != null){
        return true;
    } else{
        return false;
    }
}

// Returns true if the template exists in the database
exports.templateExists = async (templateID) =>{
    temp_check = await this.tempfromTempID(templateID);
    if(temp_check != null){
        return true;
    } else{
        return false;
    }
}

// Returns true if the userID exists in a given rating array
exports.hasRated = (array, userID) =>{
    arrayLength = array.length

    for(i=0;i<arrayLength;i++){
        if(array[i][0]==userID){
            return true
            }
            
        }
    return false;
}

// Removes a rating from a given userID in the rating array
exports.remRating = (array, userID) =>{
    arrayLength = array.length

    for(i=0;i<arrayLength;i++){
        if(array[i][0]==userID){
            oldRating = array[i][1]
            array.splice(i,1);
            return oldRating
        }
    }
    return array
}