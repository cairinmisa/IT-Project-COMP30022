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
const validateRegisterInput = require('../controllers/register');
const validateLoginInput = require('../controllers/login');

// Load User model
const User = require("../models/dbschema/user");


// @route POST api/login
// @desc Login user and return JWT token
// @access PUBLIC
router.post('/login', async (req,res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  console.log({errors, isValid});

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

/* LOGIN CHECK
// router.get('/login', function(req,res,next){
//     console.log(req.body.username);
//     if(req.body.username == null){
//         errorController.error(res, "username field missing",422);
//     } else if(req.body.password ==null){
//         errorController.error(res, "password field missing",422);
//     } else{
//         authController.login(req,res,next);
//     }
// }); */


// GET USER BY USERNAME
router.get('/userid', async function(req,res,next){
    if(req.body.username==null){
        errorController.error(res,"username field missing",422);
    } else{
        await fetchController.getOne(req, res, next);
    }
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
 
  
  /*User.findOne({ emailAddress: req.body.emailAddress }).then(user => {
    if (user) {
      return res.status(400).json({ emailAddress: "Email already exists"});
    } else {
      authController.register(req,res);
    }})
    }*/

});

/* ADD A NEW USER
// router.put('/', async function(req,res,next) {
//     if(req.body.password==null){
//         errorController.error(res,"password field required",422);
//     } else if(req.body.username==null){
//         errorController.error(res,"username field required",422);
//     } else if(req.body.emailAddress==null){
//         errorController.error(res,"emailAddress field required",422);
//     } else{
//         authController.register(req,res,next);
//     }
//
// }); */


// UPDATE A PARTICULAR USER
router.put('/update',async function(req,res,next){
    if(req.body.username==null){
        errorController.error(res,"username field required",422);
    } else {
        authController.update(req,res,next);
    }
});


// Which controller?
router.delete('/', function(req,res, next){
    if(req.body.username==null){
        errorController.error(res, "user not found", 400);
    } else {
        userController.delete(req,res,next);
    }
});

module.exports = router;
