const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');

exports.login = async (req, res, next) => {
    var response = null;
    user = await fetchController.userfromUsername(req.body.username);

    if(user.error!=null){
        errorController.error(res,"user not found", 400);
    } else  {
        try{
            if(await bcrypt.compare(req.body.password,user.password)){
                res.send({result : "Success"});
            } else {
                res.send({result : "Incorrect Password"});
            }
        } catch{
            errorController.error(res, "Hashing Error", 500);
        }
    }

};

exports.register = async (req,res,next) =>{
    //Password exists
    let response = {}
    const hashedPassword = await this.passgen(req.body.password);
    req.body.password = hashedPassword;
    if(await fetchController.usernameExists(req.body.username)){
        res.send({"usernameExists" : "True", "hasErrors" : "True"});
    } else if(await fetchController.emailExists(req.body.emailAddress)){
        res.send({"emailExists" : "True", "hasErrors" : "True"});
    }
    else{
        //Generate User ID based on number of documents, if already exists,
        // keep incrementing until it does exist
        testID = await User.countDocuments() + 1;
        while(1){
            if(!await fetchController.userIDExists(testID)){
                req.body.userID = testID;
                break;
            }
            testID ++;
        }

        User.create(req.body).then(function(user){
            response.hasErrors = "False";
            response.username = user.username;
            response.firstName = user.firstName;
            response.lastName = user.lastName;
            response.userID = user.userID;
            response.emailAddress = user.emailAddress
            console.log(response);
            res.send(response);
        }).catch(next);
    }
}

exports.update = async (req,res,next) =>{
    // Check if email exists
    if(await fetchController.emailExists(req.body.emailAddress)){
        errorController.error(res, "Email already exists", 400);
    } else{
        // Hash the new password if provided
        if(req.body.password != null){
            const hashedPassword = await this.passgen(req.body.password);
            req.body.password = hashedPassword;
        }
        const user = await fetchController.userfromUserID(req.body.userID);
        // Update the user with data in the request body
        await User.findByIdAndUpdate({_id : user._id}, req.body).then(async function(user){
            user = await fetchController.userfromUsername(req.body.username);
                res.send(user);
        }).catch(next);
    }
}

exports.passgen = async(password) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
