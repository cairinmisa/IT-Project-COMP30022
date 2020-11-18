const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

// Load controllers
const userController = require('../controllers/user');
const fetchController = require('../controllers/fetch');

// Load input validation
const validateRegisterInput = require('../controllers/validators/register');
const validateLoginInput = require('../controllers/validators/login');
const validategetUserInput = require('../controllers/validators/getUser');


// Load User model
const User = require("../models/dbschema/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;


// Returns an access token for a user (Login)
router.post('/login', async (req,res) => {
  // Check if logging in with Google 
  if(req.body.googleToken != null) {
    userController.verifyGoogleToken(req.body.googleToken, res);
    return;
  }
  

  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(200).json(errors);
  }

  const emailAddress = req.body.emailAddress;
  const password = req.body.password;

  // Find user by email
  User.findOne({emailAddress}).then(user => {
    // Check if user exists
    if (!user) {
      return res.send({ emailnotFound: "True", hasErrors: "True" });
    }
    if (user.googleUser == "True"){
      return res.send({ unauthorizedLogin: "True", hasErrors: "True"});
    }

  // Check password
  bcrypt.compare(password, user.password).then(isMatch => {
    if (isMatch) {
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
          res.json({
            hasErrors: false,
            token: "Bearer " + token,
          });
        }
      );
    } else {
      return res
        .status(200)
        .json({passwordIncorrect:"True", hasErrors : "True"});
      }
    });
  });
});

// Returns information given a particular emailAddress
router.get('/findUser/', async function(req,res,next){
  const { errors, isValid } = validategetUserInput(req.query);
  if (!isValid) {
    return res.status(200).json(errors);
  }
  let response = {}
    await User.findOne({emailAddress : req.query.emailAddress}).then(function(user){
      if(user==null){
        res.send({"emailnotFound" : "True", "hasErrors" : "True"})
      } else{
        response.hasErrors = "False";
        response.username = user.username;
        response.emailAddress = user.emailAddress;
        response.firstName = user.firstName;
        response.lastName = user.lastName;
        response.userID = user.userID;
        response.googleUser = user.googleUser;
        if(user.dOB){
          response.dOB = user.dOB;
        }
        res.send(response);
      }
  });
});

// Register a new user
router.post("/", async (req,res) => {
  // Form Validation
  const {errors, isValid} = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid){
    return res.status(200).json(errors);
  }
  await userController.register(req,res);
});

// Update a particular user
router.put('/update',passport.authenticate('jwt', {session : false}),async function(req,res,next){
  if(req.body.userID==null){
    return res.send({userIDGiven : "False", hasErrors : "True"})
  }

  // Confirm that the user is modifying their own account
  if(!(req.user.userID == req.body.userID)){
    return res.send({unauthorizedAccess : "True", hasErrors : "True"})
  }

  // Update the information
  userController.update(req,res,next);
});

// Delete a particular user
router.delete('/',passport.authenticate('jwt', {session : false}), function(req,res, next){
  // Check user is accessing their own account
  if(!(req.user.emailAddress == req.body.emailAddress)){
    return res.send({unauthorizedAccess : "True", hasErrors : "True"})
  }

  if(req.body.emailAddress == null){
    return res.send({hasErrors : "True", emailGiven : "False"})
  }
    userController.delete(req,res,next);
})

// Search for a user by Name
router.get('/searchByName', async function(req,res, next){

  var regex = new RegExp(["^", req.query.fullName, "$"].join(""),"i");
  if( req.query.fullName == null){
    return res.send({hasErrors : "True", fullNameGiven : "False"});
  }

  await User.find({fullName : regex}).then(function(nameList){
    return res.send(nameList);
  })

})

// Return user information from User ID
router.get('/usernameFromUserID',async function(req,res, next){
  if(req.query.userID == null){
    return res.send({hasErrors: "True", userIDGiven : "False"});
  }
  await User.findOne({userID : req.query.userID}).then(function(user){
    if(user==null){
      return res.send({hasErrors: "True", userExists : "False"});
    } else{
      return res.send({username : user.username, hasErrors : "False"});
    }
  })

})

module.exports = router;
