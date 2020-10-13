const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const Eportfolio = require('../models/dbschema/eportfolio');
const Template = require('../models/dbschema/templates');
const fetchController = require('./fetch');
const eportController = require('./eport');
const { updateOne } = require('../models/dbschema/eportfolio');



exports.register = async (req,res,next) =>{
    //Password exists
    let response = {}
    let result = {}
    /* TITLE CHECK
    await Eportfolio.find({userID : req.body.userID, title : req.body.title}).then(async function(list){
        result = list
    });

    if(result.length != 0){
        return res.send({titleExists : "True", hasErrors : "True"})
    }
    */

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
    console.log(neweportID);
    await Eportfolio.updateOne({eportID : neweportID}, {templateID : req.body.templateID});
    req.body.eportID = neweportID;
    
    // Create the new template, and respond with its details
    console.log(req.body);
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


