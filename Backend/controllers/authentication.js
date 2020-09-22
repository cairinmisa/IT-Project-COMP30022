const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');

// Google Authentication Library
const {OAuth2Client} = require('google-auth-library');

// Constants used for Google Authentication
const CLIENT_ID = "678370899290-c6n53p7t4351dtqgmdjl6a80qjq5h26i.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);

// Verifies a specified Google Token and then sends response
exports.verifyGoogleToken = async (token, res) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    res.send({
        result : "Success",
        name : payload['name']
    });
};

exports.login = async (req, res, next) => {
    var response = null;
    user = await fetchController.userfromEmail(req.body.emailAddress);
    if(user==null){
        errorController.error(res,"email not found", 400);
    } else  {
        try{
            if(await bcrypt.compare(req.body.password,user.password)){
                res.send({result : "Success", user : user});
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
    // Checks email and username's existence
    if(await fetchController.emailExists(req.body.emailAddress)){
        errorController.error(res, "Email already exists", 400);
    } else if(await fetchController.usernameExists(req.body.username)){
        errorController.error(res, "Username already exists", 400);
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
