const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');
const bcrypt = require('bcryptjs');


exports.delete = async (req, res, next) => {
    let response = {};
    User.findOne({emailAddress : req.body.emailAddress}).then( async function(user_id){
        if(user_id == null){
            res.send({"emailnotFound" : "True", "hasErrors" : "True"});
        } else if(!( await bcrypt.compare(req.body.password, user_id.password))){
            res.send({"passwordIncorrect" : "True","hasErrors" : "True"});
        }
         else {
            User.findByIdAndDelete({_id : user_id._id}).then(function(user){
                response.hasErrors = "False";
                response.username = user.username;
                response.emailAddress = user.emailAddress;
                response.firstName = user.firstName;
                response.lastName = user.lastName;
                response.userID = user.userID;
                res.send(response);
            }).catch(next);
        }            
    }).catch(next);

}