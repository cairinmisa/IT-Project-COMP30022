const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

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


// Load User model
const User = require("../models/dbschema/user");


// @route POST api/login
// @desc Login user and return JWT token
// @access PUBLIC
router.post('/login', async (req,res) => {
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
    userlist = await fetchController.getAll(req,res,next);
    res.send(userlist);
});


// @Route POST api/
// @desc REGISTER User
// @access PUBLIC

router.post("/", async (req,res) => {
  // Form Validation
  const {errors, isValid} = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid){
    return res.status(200).json(errors);
  }
  await authController.register(req,res);

});

// UPDATE A PARTICULAR USER
router.put('/update',async function(req,res,next){
    if(req.body.username==null){
        errorController.error(res,"username field required",422);
    } else {
        authController.update(req,res,next);
    }
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
        // Delete User
        userController.delete(req,res,next);
    }
});

module.exports = router;
