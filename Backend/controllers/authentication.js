const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

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
    console.log(payload);

    // If the users email already exists
    await User.findOne({emailAddress : payload.email}).then(async function(target_user){
        // Need to create the user then generate the token if user doesn't exist
        // with that email
        if(target_user == null){
            this.registerGoogleUser(payload,res);
            this.generateToken(target_user.emailAddress,res);
        } else if (target_user.googleUser == "True") {
            // Otherwise if the user exists and is a google user, then return a token
            this.generateToken(target_user.emailAddress,res);

        } else {
            // Otherwise the user exists, but is not a google user, so don't authenticate
            return res.send({hasErrors : "True", emailExists : "True"})
        }
    })

};
// Generates a valid JWT token for the user defined by the given email address
generateToken = async (emailAddress,res) =>{
    token = {}
    const user = await User.findOne({emailAddress : emailAddress});
    // User matched, create JWT payload
    const payload = {
        id: user._id,
        name: user.username
      };
      // Sign token
      jwt.sign(
        payload,
        keys.secretOrKey,
        {expiresIn: 3600},
        (err, token) => {
            console.log(token);
            res.json({
              hasErrors: false,
              token: "Bearer " + token,
            });
          }
      );
}

registerGoogleUser = async (payload,res) =>{
    // Data Is an object to store the values used to create the user
    let data = {}
    // Set given information
    data.firstName = payload.given_name
    data.lastName = payload.family_name
    data.fullName = payload.name
    data.emailAddress = payload.email

    // Set Password (Irrelevant since google users cannot login with this password)
    data.password = "password"

    // Set UserID

    testID = await User.countDocuments() + 1;
    while(1){
       if(!await fetchController.userIDExists(testID)){
            data.userID = testID;
            break;
        }
        testID ++;
    }
    
    // Set Username
    data.username = data.fullName + "#" + data.userID.toString()
    
    // Set GoogleUser
    data.googleUser = "True"
    
    await User.create(data)

}

exports.register = async (req,res,next) =>{

    // Set Full Name value
    req.body.fullName = req.body.firstName + " " + req.body.lastName;
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
            response.fullName = user.fullName;
            response.userID = user.userID;
            response.emailAddress = user.emailAddress
            console.log(response);
            res.send(response);
        }).catch(next);
    }
}

exports.update = async (req,res,next) =>{
    // Check user exists
    if(!(await fetchController.userIDExists(req.body.userID))){
        return res.send({userExists : "False", hasErrors : "True"})
    }
    
    // Fetch user
    const user = await fetchController.userfromUserID(req.body.userID);
    
    // Ensure googleUser isn't trying to modify fields that are unallowed
    if(user.googleUser){
        if(req.body.emailAddress != null || req.body.password != null){
            res.send({unauthorizedLogin : "True", hasErrors : "True"});
        }
    }

    // Checks given password is correct if they are not a google user
    if(user.googleUser == null){
        if(!(await bcrypt.compare(req.body.oldpassword,user.password))){
            return res.send({incorrectPassword : "True", hasErrors : "True"})
        }
    }
    // Checks new email is valid
    if(req.body.emailAddress != null){
        if (!validator.isEmail(req.body.emailAddress)) {
            return res.send({emailValid : "False", hasErrors : "True"});
          }
        
        if(await fetchController.emailExists(req.body.emailAddress)){
            return res.send({emailExists : "True", hasErrors : "True"})
        }
    }
    // Check new username is valid
    if(req.body.username != null){
        if(await fetchController.usernameExists(req.body.username)){
            return res.send({userExists : "True", hasErrors : "True"})
        }
    }
    // Hash the new password if provided
    if(req.body.password != null){
        console.log(req.body.password);
        console.log(validator.isLength(req.body.password, { min: 6, max: 20}))
        if (!validator.isLength(req.body.password, { min: 6, max: 20})) {
            return res.send({passwordLength : "False", hasErrors : "True"})
          }
        const hashedPassword = await this.passgen(req.body.password);
        req.body.password = hashedPassword;
    }
    delete req.body.oldpassword;
    delete req.body.oldpassword2;
    
    
    // Fix fullName if new name is entered
    await User.find({userID : req.body.userID}).then(function(olduser){
        if((req.body.firstName != null) && (req.body.lastName != null)){
            req.body.fullName = req.body.firstName + " " + req.body.lastName
        } else if (req.body.firstName != null && (req.body.lastName == null)){
            req.body.fullName = req.body.firstName + " " + olduser.lastName
        } else if (req.body.firstName == null && (req.body.lastName != null)){
            req.body.fullName = olduser.firstName + " " + req.body.lastName
        }
    })
    
    
    // Update the user with data in the request body
    await User.findByIdAndUpdate({_id : user._id}, req.body).then(async function(){
        await fetchController.userfromUserID(req.body.userID).then(async function(newuser){
            newuser.hasErrors = "False"
            res.send(newuser);
        });
    }).catch(next);
}

exports.passgen = async(password) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
