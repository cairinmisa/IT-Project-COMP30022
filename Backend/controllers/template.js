const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const Eportfolio = require('../models/dbschema/eportfolio');
const Template = require('../models/dbschema/templates');
const fetchController = require('./fetch');
const eportController = require('./eport');
const { updateOne } = require('../models/dbschema/eportfolio');



exports.create = async (req,res,next) =>{
    //Password exists
    let response = {}
    let result = {}

    // Eportfolio Check, Checks if eportfolio already exists in db (with that userID)
    await Eportfolio.find({eportID : req.body.eportID, userID : req.body.userID}).then(async function(list){
        result = list
    });
    if(result.length == 0){
        return res.send({hasErrors : "False", eportExists : "False"})
    }

    
    // Set Default values for other fields
    if(req.body.isPublic == null){
        req.body.isPublic = "False"
    }
    if(req.body.comments == null){
        req.body.comments = ""
    }
    req.body.dateUpdated = req.body.dateCreated
    req.body.ratingTotal = 0
    req.body.rating = 0
    req.body.ratedUsers = []
    // Generate new templateID
    testID = await Template.countDocuments() + 1;
    while(1){
          if(!await fetchController.templateExists(testID)){
            req.body.templateID = testID;
            break;
          }
          testID ++;
    }
    // Create new eportfolio by copying the data from the old one
    neweportID = await eportController.copy(req.body.eportID);
    await Eportfolio.updateOne({eportID : neweportID}, {templateID : req.body.templateID});
    req.body.eportID = neweportID;
    
    // Create the new template, and respond with its details
    Template.create(req.body).then(function(template){

        response.hasErrors = "False";
        response.eportID = template.eportID;
        response.isPublic = template.isPublic;
        response.comments = template.comments;
        response.title = template.title;
        response.category = template.category;
        response.userID = template.userID;
        response.dateCreated = template.dateCreated
        response.templateID = template.templateID
        res.send(response);
        }).catch(next);
}

exports.createfromTemplate = async (req,res,next) =>{
     let response = {}
    
     // Checks if the user exists
    if(!(await fetchController.userIDExists(req.query.userID))){
        return res.send({hasErrors : "True", userExists : "False"})
    }
     // Check if the template Exists, and if it does, copy the data across
     await Template.findOne({templateID : req.body.templateID}).then(async function(template){
         if(template==null){
             return res.send({templateExists : "False", hasErrors : "True"});
         } else{
             //Template does exist, find the data within the folio
             await Eportfolio.findOne({eportID : template.eportID}).then(function(eport){
                 console.log(eport.data);
                req.body.data = eport.data
             })
             
         }
     })

     // Checks if the title already exists for the user
     let result = {}
     await Eportfolio.find({userID : req.body.userID, title : req.body.title}).then(async function(list){
         result = list
     });
     if(result.length != 0){
         return res.send({titleExists : "True", hasErrors : "True"})
     }

     // Set the other default fields for the new folio
     if(!(req.body.isPublic == "True")){
         req.body.isPublic = "False"
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
        // Finally create the folio and send the relevant information back
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

