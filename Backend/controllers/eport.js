const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const Eportfolio = require('../models/dbschema/eportfolio');
const fetchController = require('./fetch');
const errorController = require('./error');



exports.register = async (req,res,next) =>{
    //Password exists
    console.log("first console log")
    console.log(req.body)
    let response = {}
    if(req.body.isPublic == null){
        req.body.isPublic = "False"
    }
    if(req.body.data == null){
        req.body.data = ""
    }
    req.body.dateUpdated = req.body.dateCreated
    req.body.version = 1;
    //Generate User ID based on number of documents, if already exists,
     // keep incrementing until it does exist
    testID = await Eportfolio.countDocuments() + 1;
    while(1){
          if(!await fetchController.eportExists(testID)){
            req.body.eportID = testID;
            break;
          }
          testID ++;
    }console.log("final console log")
        console.log(req.body);
        Eportfolio.create(req.body).then(function(eport){
            console.log("final product")
            console.log(eport)
            response.hasErrors = "False";
            response.eportID = eport.eportID;
            response.isPublic = eport.isPublic;
            response.data = eport.data;
            response.title = eport.title;
            response.version = eport.version;
            response.userID = eport.userID;
            response.dateCreated = eport.dateCreated
            res.send(response);
        }).catch(next);
}



exports.fetch = async (req,res) =>{
    //Password exists
    console.log(req.user)
    let response = {}
    // Check eportfolio exists
     if(!( await fetchController.eportExists(req.body.eportID))){
         return res.send({eportfolioExists : false, hasErrors : true})
     } else{
        const eportfolio = await fetchController.eportfromEportID(req.body.eportID);

        // If another user accessing and the eportfolio is private
        if(!(req.user.userID == eportfolio.userID) && (eportfolio.isPublic == "False")){
             return res.send({unauthorizedAccess : "True", hasErrors : "True"})
        } else{
            // Otherwise return its information
            response.hasErrors = "False";
            response.eportID = eportfolio.eportID;
            response.isPublic = eportfolio.isPublic;
            response.data = eportfolio.data;
            response.title = eportfolio.title;
            response.version = eportfolio.version;
            response.userID = eportfolio.userID;
            response.dateCreated = eportfolio.dateCreated
            res.send(response);
        }
     }
    
}

exports.delete = async (req,res) =>{

    let response = {}

    // Check eportfolio exists
     if(!( await fetchController.eportExists(req.body.eportID))){
         return res.send({eportfolioExists : false, hasErrors : true})
     } else{
        const eport = await fetchController.eportfromEportID(req.body.eportID);
        
        // Check the correct user is accessing
        if(!(req.user.userID == eport.userID)){
             return res.send({unauthorizedAccess : "True", hasErrors : "True"})
        } else{
            // Return information to the sender
            Eportfolio.findByIdAndDelete({_id : eport._id}).then(function(eportfolio){
            response.hasErrors = "False";
            response.eportID = eportfolio.eportID;
            response.isPublic = eportfolio.isPublic;
            response.data = eportfolio.data;
            response.title = eportfolio.title;
            response.version = eportfolio.version;
            response.userID = eportfolio.userID;
            response.dateCreated = eportfolio.dateCreated
            res.send(response);
        });
     }
    
}
}