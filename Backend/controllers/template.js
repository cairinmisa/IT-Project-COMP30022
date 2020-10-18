const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const Eportfolio = require('../models/dbschema/eportfolio');
const Template = require('../models/dbschema/templates');
const fetchController = require('./fetch');
const eportController = require('./eport');
const { updateOne, findByIdAndUpdate } = require('../models/dbschema/eportfolio');


// Creates a template given an eportfolio
exports.create = async (req,res,next) =>{
    //Password exists
    let response = {}
    let result = {}

    //TITLE CHECK
    await Template.find({userID : req.body.userID, title : req.body.title}).then(async function(list){
        result = list
    });

    if(result.length != 0){
        return res.send({titleExists : "True", hasErrors : "True"})
    }

    // Eportfolio Check, Checks if eportfolio already exists in db (with that userID)
    await Eportfolio.findOne({eportID : req.body.eportID, userID : req.body.userID}).then(async function(list){
        if(list != null){
            req.body.data = list.data;
        }
    });
    if(result == null){
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

    // Create the new template, and respond with its details
    Template.create(req.body).then(function(template){
        response.hasErrors = "False";
        response.eportID = template.eportID;
        response.isPublic = template.isPublic;
        response.comments = template.comments;
        response.data = template.data;
        response.title = template.title;
        response.category = template.category;
        response.userID = template.userID;
        response.dateCreated = template.dateCreated
        response.templateID = template.templateID
        res.send(response);
        }).catch(next);
}


// Creates a new eportfolio given a template
exports.createfromTemplate = async (req,res,next) =>{
     let response = {}
    
     // Checks if the user exists
    if(!(await fetchController.userIDExists(req.body.userID))){
        return res.send({hasErrors : "True", userExists : "False"})
    }

     // Check if the template Exists, and if it does, copy the data across
     await Template.findOne({templateID : req.body.templateID}).then(async function(template){
         if(template==null){
             return res.send({templateExists : "False", hasErrors : "True"});
         } else{
            req.body.data = template.data 
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

exports.deleteTemplate = async (req,res,next) =>{
    
    let response = {}
    console.log(req.user.userID);
    // Check template exists
    await Template.findOne({templateID : req.body.templateID}).then(async function(template){
        console.log(template);
        if(template==null){
            return res.send({templateExists : "False", hasErrors : "True"});
        } // Check the right user is accessing 
        else if(!(req.user.userID == template.userID)){
            return res.send({unauthorizedAccess : "True", hasErrors : "True"})
        } else {
            // Finally, delete the template
            Template.findByIdAndDelete({_id : template._id}).then(function(temp){
                response.templateID = temp.templateID
                response.hasErrors = "False";
                response.eportID = temp.eportID;
                response.isPublic = temp.isPublic;
                response.data = temp.category;
                response.title = temp.title;
                response.userID = temp.userID;
                response.dateCreated = temp.dateCreated
                response.rating = temp.rating
                res.send(response);
            })
        }
            
    })
}

exports.saveTemplate = async (req,res,next) =>{
    let updateData = {}
    let response = {}
    updateData.dateUpdated = req.body.dateUpdated
    // If nothing given, then return an error
    if(req.body.data == null && req.body.title == null 
        && req.body.isPublic == null && req.body.category==null){
            console.log("got here");
            return res.send({hasErrors : "True", giveInput : "Please"});
        }
    // If Public is invalid, delete the field
    if((req.body.isPublic == "True") || (req.body.isPublic == "False")){
        updateData.isPublic = req.body.isPublic
    }
    
    // If category exists, add it to update list
    if(req.body.category != null){
        updateData.category = req.body.category
    }

    // If date exists, add it to update list
    if(req.body.data != null){
        updateData.data = req.body.data
    }

    // Checks if the title already exists for the user, iif not then add to the updateData
    await Template.find({userID : req.body.userID, title : req.body.title}).then(async function(list){
        result = list
    });
    if(result.length != 0){
        return res.send({titleExists : "True", hasErrors : "True"})
    } else if((req.body.title != null) && (req.body.title.length > 0)){
        updateData.title = req.body.title
    }


    const template = await fetchController.tempfromTempID(req.body.templateID);
    if(template ==null){
        return res.send({templateExists : "False", hasErrors : "True"});
    } else if(!(req.user.userID == template.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
    } else {
        // Finally, update the template
        console.log(updateData)
        Template.findByIdAndUpdate({_id : template._id},updateData).then(async function(){
            await fetchController.tempfromTempID(req.body.templateID).then(async function(newtemp){
                res.send(newtemp);
            });
        })
    }

}

