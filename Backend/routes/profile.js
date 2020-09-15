const express = require("express");
const User = require("../models/dbschema/user");
const router = express.Router();

router.get('/', (req, res)=> {
    User.find(function (err, user){
        if (err) {
            console.log(err);
        } else {
            res.json(user);
        }
    });
});

router.get('/:id').get(function(req,res){
    let id = req.params.id;
    User.findById(id, function(err, user){
        res.json(user);
    });
});

router.post('/add', function(req,res) {
    // New instance of user based on our data model
    let user = new User({
        userID: req.body.userID
    });
    user.save()
        .then(user => {
            res.status(200).json({'user' : 'user added successfully'})
        })
        .catch(err => {
            res.status(400).send('adding new user failed')
        });

});

router.post('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function (err, user){
        if(!user)
            res.status(404).send('data is not found');
        else
            user.userID = req.body.userID;
            user.username = req.body.username;
            user.password = req.body.password;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.emailAddress = req.body.emailAddress;
            user.dOB = req.body.dOB;
            user.save().then(todo =>{
                res.json('Todo updated');
            })

            .catch(err => {
                res.status(400).send("Update not possible");
            });

    });
});

module.exports = router;