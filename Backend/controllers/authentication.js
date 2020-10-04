const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const User = require('../models/dbschema/user');
const fetchController = require('./fetch');
const errorController = require('./error');

exports.login = async (req, res, next) => {
    var response = null;
    user = await fetchController.userfromEmail(req.body.emailAddress);
    if(user==null){
        errorController.error(res,"email not found", 400);
    } else  {
        try{
            if(await bcrypt.compare(req.body.password,user.password)){
                res.send({result : "Success", user : user});
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
    let response = {}
    const hashedPassword = await this.passgen(req.body.password);
    req.body.password = hashedPassword;
    if(await fetchController.usernameExists(req.body.username)){
        res.send({"usernameExists" : "True", "hasErrors" : "True"});
    } else if(await fetchController.emailExists(req.body.emailAddress)){
        res.send({"emailExists" : "True", "hasErrors" : "True"});
    }
    else{
        //Generate User ID based on number of documents, if already exists,
        // keep incrementing until it does exist
        testID = await User.countDocuments() + 1;
        while(1){
            if(!await fetchController.userIDExists(testID)){
                req.body.userID = testID;
                break;
            }
            testID ++;
        }

        User.create(req.body).then(function(user){
            response.hasErrors = "False";
            response.username = user.username;
            response.firstName = user.firstName;
            response.lastName = user.lastName;
            response.userID = user.userID;
            response.emailAddress = user.emailAddress
            console.log(response);
            res.send(response);
        }).catch(next);
    }
}

exports.update = async (req,res,next) =>{
    if(!(await fetchController.userIDExists(req.body.userID))){
        return res.send({userExists : "False", hasErrors : "True"})
    }
    
    // Checks given password is correct
    const user = await fetchController.userfromUserID(req.body.userID);
    if(!(await bcrypt.compare(req.body.oldpassword,user.password))){
        return res.send({incorrectPassword : "True", hasErrors : "True"})
    }
    
    // Checks new email is valid
    if(req.body.emailAddress != null){
        if (!validator.isEmail(req.body.emailAddress)) {
            return res.send({emailValid : "False", hasErrors : "True"});
          }
        
        if(await fetchController.emailExists(req.body.emailAddress)){
            return res.send({emailExists : "True", hasErrors : "True"})
        }
    }
    // Check new username is valid
    if(req.body.username != null){
        if(await fetchController.usernameExists(req.body.username)){
            return res.send({userExists : "True", hasErrors : "True"})
        }
    }
    // Hash the new password if provided
    if(req.body.password != null){
        console.log(req.body.password);
        console.log(validator.isLength(req.body.password, { min: 6, max: 20}))
        if (!validator.isLength(req.body.password, { min: 6, max: 20})) {
            return res.send({passwordLength : "False", hasErrors : "True"})
          }
        const hashedPassword = await this.passgen(req.body.password);
        req.body.password = hashedPassword;
    }
    console.log(req.body)
    delete req.body.oldpassword;
    delete req.body.oldpassword2;
    console.log(req.body)
    

    
    // Update the user with data in the request body
    await User.findByIdAndUpdate({_id : user._id}, req.body).then(async function(user){
        await fetchController.userfromUserID(req.body.userID).then(async function(newuser){
            console.log("got here")
            newuser.hasErrors = "False"
            res.send(newuser);
        });
    }).catch(next);
}

exports.passgen = async(password) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}
