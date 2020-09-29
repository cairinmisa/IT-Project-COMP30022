const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

// Load controllers
const eportController = require('../controllers/eport');
const fetchController = require('../controllers/fetch');
const errorController = require('../controllers/error');
const userController = require('../controllers/user');

// Load input validation
const validatenewEportInput = require('../controllers/validators/newEport');



// Load User model
const Eportfolio = require("../models/dbschema/eportfolio");


const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

router.get('/', async (req, res,next)=> {
    eportlist = await fetchController.getAllEports(req,res,next);
    res.send(eportlist);
})


router.post('/create',passport.authenticate('jwt', {session : false}), (req, res)=> {

    const { errors, isValid } = validatenewEportInput(req.body);
    console.log(errors, isValid)
    // Check Validation
    if (!isValid) {
    return res.status(200).json(errors);
    }
    // Check user is modifying their own account
    if(!(req.user.userID == req.body.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
      }
    eportController.register(req,res)
})

module.exports = router;