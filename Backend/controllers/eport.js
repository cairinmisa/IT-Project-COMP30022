const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const Eportfolio = require('../models/dbschema/eportfolio');
const fetchController = require('./fetch');
const errorController = require('./error');



exports.register = async (req,res,next) =>{
    //Password exists
    let response = {}
    let result = {}
    await Eportfolio.find({userID : req.body.userID, title : req.body.title}).then(async function(list){
        result = list
    });

    if(result.length != 0){
        return res.send({titleExists : "True", hasErrors : "True"})
    }
    if(req.body.isPublic == null){
        req.body.isPublic = "False"
    }
    if(req.body.data == null){
        req.body.data = ""
    }
    req.body.dateUpdated = req.body.dateCreated
    req.body.version = 1;
    req.body.isLatest = "True";
    //Generate User ID based on number of documents, if already exists,
     // keep incrementing until it does exist
    testID = await Eportfolio.countDocuments() + 1;
    while(1){
          if(!await fetchController.eportExists(testID)){
            req.body.eportID = testID;
            break;
          }
          testID ++;
    }
        Eportfolio.create(req.body).then(function(eport){

            response.hasErrors = "False";
            response.eportID = eport.eportID;
            response.isPublic = eport.isPublic;
            response.data = eport.data;
            response.title = eport.title;
            response.version = eport.version;
            response.userID = eport.userID;
            response.dateCreated = eport.dateCreated
            response.isLatest = eport.isLatest;
            res.send(response);
        }).catch(next);
}



exports.fetchOne = async (req,res) =>{
    //Password exists
    let response = {}
    // Check eportfolio exists
     if(!( await fetchController.eportExists(req.body.eportID))){
         return res.send({eportfolioExists : "False", hasErrors : "True"})
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

exports.fetchAll = async (req,res) =>{
    // Check user exists
    if(!( await fetchController.userIDExists(req.body.userID))){
        return res.send({userExists : false, hasErrors : true})
    }
    // Check right user accessing
    if(!(req.user.userID == req.body.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"});
    }
    // Find all folios matching userID
    await Eportfolio.find({userID : req.body.userID})
    .then(function(allFolios){
        return res.send(allFolios);
    });
}

exports.saveEport = async (req,res) =>{
    // Check eport exists
    if(!( await fetchController.eportExists(req.body.eportID))){
         return res.send({eportExists : false, hasErrors : true});
    }
    const eportfolio = await fetchController.eportfromEportID(req.body.eportID);
    const eport_info = {}
    // If another user accessing and the eportfolio is private

    if(!(req.user.userID == eportfolio.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
   }
   eport_info.data = req.body.data
   eport_info.dateUpdated = req.body.dateUpdated
   eport_info.version = eportfolio.version + 1
   if(req.body.isPublic != null){
       eport_info.isPublic = req.body.isPublic
   }
   if(req.body.title != null){
    eport_info.title = req.body.title
   }

   await Eportfolio.findByIdAndUpdate({_id : eportfolio._id}, eport_info)
   .then(async function(user){
        const response = await fetchController.eportfromEportID(req.body.eportID);
        res.send(response);

}).catch(next);
    // Find all folios matching userID
    await Eportfolio.find({userID : req.body.userID}).then(function(allFolios){
        return res.send(allFolios);
    });
}


exports.delete = async (req,res) =>{

    let response = {}

    // Check eportfolio exists
     if(!( await fetchController.eportExists(req.body.eportID))){
         return res.send({eportExists : false, hasErrors : true})
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