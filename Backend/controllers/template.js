const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('is-empty');
const Eportfolio = require('../models/dbschema/eportfolio');
const Template = require('../models/dbschema/templates');
const fetchController = require('./fetch');
const errorController = require('./error');



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
    //Generate Template ID based on number of documents, if already exists,
    // keep incrementing until it does exist
    testID = await Template.countDocuments() + 1;
    while(1){
          if(!await fetchController.templateExists(testID)){
            req.body.templateID = testID;
            break;
          }
          testID ++;
    }
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


