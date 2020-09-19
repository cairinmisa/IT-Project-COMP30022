const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');


exports.delete = async (req, res, next) => {
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