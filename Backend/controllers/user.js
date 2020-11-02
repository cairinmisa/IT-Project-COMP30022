const User = require('../models/dbschema/user');
const Template = require('../models/dbschema/templates');
const Eportfolio = require('../models/dbschema/eportfolio');
const fetchController = require('./fetch');
const errorController = require('./error');
const bcrypt = require('bcryptjs');


exports.delete = async (req, res, next) => {
    let response = {};
    User.findOne({emailAddress : req.body.emailAddress}).then( async function(user){
        // User doesn't exist
        if(user == null){
            res.send({"emailnotFound" : "True", "hasErrors" : "True"});
            return;
        }
        // If not googleUser, then compare the password given to the user password
        if(user.googleUser == null){
            if(req.body.password == null){
                res.send({"passwordGiven" : "False",hasErrors : "True"});
            }
            if(req.body.password2 == null){
                res.send({"password2Given" : "False",hasErrors : "True"});
            }
            if(req.body.password != req.body.password2){
                res.send({"passwordMatch" : "False",hasErrors : "True"});
            }
            if(!( await bcrypt.compare(req.body.password,user.password))){
               res.send({"passwordIncorrect" : "True",hasErrors : "True"});
            }
        }
        await Template.deleteMany({userID: user.userID});

        await Eportfolio.deleteMany({userID: user.userID});


        User.findByIdAndDelete({_id : user._id}).then(function(user2){
            response.hasErrors = "False";
            response.username = user2.username;
            response.emailAddress = user2.emailAddress;
            response.firstName = user2.firstName;
            response.lastName = user2.lastName;
            response.userID = user2.userID;
            res.send(response);
        }).catch(next);
    })            
}
