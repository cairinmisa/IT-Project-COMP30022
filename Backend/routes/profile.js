const express = require("express");
const User = require("../models/dbschema/user");
const router = express.Router();
const bcrypt = require('bcryptjs');
const authController = require('../controllers/authentication');
const fetchController = require('../controllers/fetch');
const errorController = require('../controllers/error');

// LOGIN CHECK
router.get('/login', function(req,res,next){
    console.log(req.body.username);
    if(req.body.username == null){
        errorController.error(res, "username field missing",422);
    } else if(req.body.password ==null){
        errorController.error(res, "password field missing",422);
    } else{
        authController.login(req,res,next);
    }
});


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


// ADD A NEW USER
router.put('/', async function(req,res,next) {
    if(req.body.password==null){
        errorController.error(res,"password field required",422);
    } else if(req.body.username==null){
        errorController.error(res,"username field required",422);
    } else if(req.body.emailAddress==null){
        errorController.error(res,"emailAddress field required",422);
    } else{
        authController.register(req,res,next);
    }
        
});


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
        res.status(422);
        res.send({error: "no username provided"});
    } else {
        User.findOne({username : req.body.username}, {_id : 1}).then(function(user_id){
            if(user_id == null){
                errorController.error(res, "user not found", 400);
            } else {
                User.findByIdAndDelete({_id : user_id._id}).then(function(user){
                    res.send(user);
                }).catch(next);
            }            
        }).catch(next);
    }
});


module.exports = router;