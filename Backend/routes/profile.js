const express = require("express");
const User = require("../models/dbschema/user");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/login', function(req,res,next){
    console.log(req.body.username);
    if(req.body.username == null){
        res.status(422);
        res.send({error : "username required"});
    } else if(req.body.password ==null){
        res.status(422);
        res.send({error : "password required"});
    } else{

        User.findOne({username : req.body.username}, {username : 1, password : 1}).then( async function(user_prop){
            if(user_prop!= null){
                try{
                    console.log(req.body.password);
                    console.log(user_prop.password);
                    if(await bcrypt.compare(req.body.password,user_prop.password)){
                        res.send({result : "Success"});
                    } else {
                        res.send({result : "Incorrect password"});
                    }
                } catch{
                    // Hashing Error
                    res.status(500).send();
                }
            } else{
                // Can't find user
                res.status(422);
                res.send ({error : "cannot find user"});
            }

        }).catch(next);
    }
});

router.get('/userid',function(req,res,next){
    console.log("got here");
    console.log(req.body.username);
    //console.log(getIDbyUsername(req.body.username))
    User.findOne({username : req.body.username}, {_id : 1}).then(function(user){
        res.send(user);
    }).catch(next);
});


router.get('/', function(req,res,next){
    User.find().then(function(users){
        res.send(users);
    }).catch(next);
});



router.put('/', async function(req,res,next) {
    if(req.body.password){
        try{
            //Password exists
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            User.create(req.body).then(function(user){
                res.send(user);
            }).catch(next);
        } catch {
            // Error Hashing
            res.status(500).send();
        }
    } else{
        // Password does not exist
        res.status(422)
        res.send({error : "Password field required"});
    }     
});

router.put('/update',async function(req,res,next){

    // If update wants to change the password, then hash the new password
    if(req.body.password){
        try{

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        } catch {
            // Error Hashing
            res.status(500).send();
        }
    }

    User.findByIdAndUpdate({_id : req.body._id}, req.body).then(function(user){
        console.log(user._id);

        User.findOne({_id : user._id}).then(function(user){

            res.send(user);
        });
    }).catch(next);
});



router.delete('/:id', function(req,res, next){
    if(req.body.username==null){
        res.status(422);
        res.send({error: "no username provided"});
    } else {
        User.findOne({username : req.body.username}, {_id : 1}).then(function(user_id){
            User.findByIdAndDelete({_id : user_id._id}).then(function(user){
                res.send(user);
            }).catch(next);
        }).catch(next);
    }
});

function getIDbyUsername(username){
    User.findOne({username : username}, {_id : 1}).then(function(id){
        return id;
    });
};

module.exports = router;