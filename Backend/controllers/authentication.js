const bcrypt = require('bcryptjs');
const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');

exports.login = async (req, res, next) => {
    var response = null;
    user = await fetchController.userfromUsername(req.body.username);

    if(user.error!=null){
        errorController.error(res,"user not found", 400);
    } else  {
        try{
            if(await bcrypt.compare(req.body.password,user.password)){
                res.send({result : "Success"});
            } else {
                res.send({result : "Incorrect Password"});
            }
        } catch{
            errorController.error(res, "Hashing Error", 500);
        }
    }

};

exports.register = async (req,res,next) =>{
    //Password exists

    const hashedPassword = await this.passgen(req.body.password);
    req.body.password = hashedPassword;
    if(await fetchController.usernameExists(req.body.username)){
        errorController.error(res, "Username already exists", 400);
    } else if(await fetchController.emailExists(req.body.emailAddress)){
        errorController.error(res, "Email already exists", 400);
    } else if((req.body.userID)){
        errorController.error(res, "Cannot provide userID", 422);
    }
    else{
        //Temporary UserID Line, Needs to be replaced with function
        req.body.userID = "TempID";
        User.create(req.body).then(function(user){
            res.send(user);
        }).catch(next);
    }
}

exports.update = async (req,res,next) =>{
    if(await fetchController.emailExists(req.body.emailAddress)){
        errorController.error(res, "Email already exists", 400);
    } else{
        if(req.body.password != null){
            const hashedPassword = await this.passgen(req.body.password);
            req.body.password = hashedPassword;
        }
        const user = await fetchController.userfromUsername(req.body.username);
        console.log(user);
        await User.findByIdAndUpdate({_id : user._id}, req.body).then(async function(user){
            console.log(user._id);
            user = await fetchController.userfromUsername(req.body.username);
                res.send(user);
        }).catch(next);
    }
}

exports.passgen = async(password) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
