const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

// Load controllers
const authController = require('../controllers/authentication');
const fetchController = require('../controllers/fetch');
const errorController = require('../controllers/error');
const userController = require('../controllers/user');

// Load input validation
const validateRegisterInput = require('../controllers/validators/register');
const validateLoginInput = require('../controllers/validators/login');
const validateDeleteInput = require('../controllers/validators/delete');
const validategetUserInput = require('../controllers/validators/getUser');
const validateupdateInput = require('../controllers/validators/update');


// Load User model
const User = require("../models/dbschema/user");


const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;


// @route POST api/login
// @desc Login user and return JWT token
// @access PUBLIC
router.post('/login', async (req,res) => {
  // Check if logging in with Google 
  if(req.body.googleToken != null) {
    console.log("A User Logged in With Google");
    authController.verifyGoogleToken(req.body.googleToken, res);
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
      return res.status(200).json({ emailnotFound: "True", hasErrors: "True"
    });
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

// @Route GET api/
// @desc RETURN User
// @access PUBLIC
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
        if(user.dOB){
          response.dOB = user.dOB;
        }
        res.send(response);
      }
  });
});

// GET ALL USERS
router.get('/',async function(req,res,next){

    userlist = await fetchController.getAllUsers(req,res,next);
    res.send(userlist);
});

// @Route POST api/
// @desc REGISTER User
// @access PUBLIC

router.post("/", async (req,res) => {
  // Form Validation
  const {errors, isValid} = validateRegisterInput(req.body);
  console.log(req.user);
  console.log(req.body.username);
  // Check Validation
  if (!isValid){
    return res.status(200).json(errors);
  }
  await authController.register(req,res);
});

// @Route PUT api/
// @desc MODIFY User
// @access PUBLIC
router.put('/update',passport.authenticate('jwt', {session : false}),async function(req,res,next){

  // Validate input
  const {errors, isValid} = validateupdateInput(req.body);
  if (!isValid){
    return res.status(200).json(errors);
  }

  // Confirm that the user is modifying their own account
  if(!(req.user.userID == req.body.userID)){
    return res.send({unauthorizedAccess : "True", hasErrors : "True"})
  }

  // Update the information
  authController.update(req,res,next);
});


// @Route DELETE api/
// @desc DELETE User
// @access PUBLIC
router.delete('/', function(req,res, next){

  // Validate Input
  const { errors, isValid } = validateDeleteInput(req.body);
  if (!isValid){
    return res.status(200).json(errors);
  }
  else {
        userController.delete(req,res,next);
    }
});

router.get('/searchByName', async function(req,res, next){
  if( req.body.fullName == null){
    return res.send({hasErrors : "True", fullNameGiven : "False"});
  }

  await User.find({fullName : req.body.fullName}).then(function(nameList){
    return res.send(nameList);
  })

})

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
