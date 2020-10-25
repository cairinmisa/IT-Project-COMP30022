const express = require("express");
const router = express.Router();
const passport = require('passport');

// Load controllers
const eportController = require('../controllers/eport');
const fetchController = require('../controllers/fetch');
const templateController = require('../controllers/template');

// Load input validation
const validatenewTemplateInput = require('../controllers/validators/newTemplate');
const validatenewEportInput = require('../controllers/validators/newEport');

// Load Template module
const Template = require("../models/dbschema/templates");
const { findByIdAndUpdate } = require("../models/dbschema/templates");


// Get all templates
router.get('/', async (req, res,next)=> {
    await Template.find().then(function(templates){
        res.send(templates);
    })
})

// Create a new template
router.post('/create',passport.authenticate('jwt', {session : false}), (req, res)=> {
    
    const { errors, isValid } = validatenewTemplateInput(req.body);
    // Check Validation
    if (!isValid) {
     return res.status(200).json(errors);
    }
    // Check user is modifying their own account
    if(!(req.user.userID == req.body.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
      }

    templateController.create(req, res);
})

// Create a new eportfolio from a template
router.post('/createFolio',passport.authenticate('jwt', {session : false}), (req, res)=> {
    // Validates necessary eport information exists
    const { errors, isValid } = validatenewEportInput(req.body);
    if (!isValid) {
     return res.status(200).json(errors);
    }
    // Validates the Template ID is provided
    if (req.body.templateID == null){
        return ({hasErrors : "True", templateIDGiven : "False"});
    }
    
    // Check user is creating their own folio
    if(!(req.user.userID == req.body.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
    }

    templateController.createfromTemplate(req,res)
})


// Delete an existing template
router.delete('/',passport.authenticate('jwt', {session : false}), (req, res)=> {
    // Validates the Template ID is provided
    if (req.body.templateID == null){
        return ({hasErrors : "True", templateIDGiven : "False"});
    }
    
    templateController.deleteTemplate(req,res)
})
// Fetch all public templates
router.get('/getPublic',async (req, res)=> {

    if(req.query.category!=null){
        await Template.find({isPublic : "True", category : req.query.category}).then(function(categoryList){
            return res.send(categoryList)
        })
    } else{
        await Template.find({isPublic : "True"}).then(function(tempList){
            return res.send(tempList);
        })
    }

    

})

// Fetch all templates from a user
router.get('/fetchFromUser/',passport.authenticate('jwt', {session : false}),async (req, res)=> {

    if(!(req.user.userID == req.query.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
    }

    if(req.query.userID==null){
        return ({hasErrors : "True", userIDGiven : "False"});
    }

    await Template.find({userID : req.query.userID}).then(function(tempList){
        return res.send(tempList);
    })

})

router.put('/saveTemplate/',passport.authenticate('jwt', {session : false}),async (req, res)=> {
  if(req.body.dateUpdated == null){
      return res.send({hasErrors : "True", dateGiven : "False"});
  }
  if(req.body.templateID == null){
    return res.send({hasErrors : "True", templateIDGiven : "False"});
  }
  templateController.saveTemplate(req,res);
})

router.get('/searchByTitle', async function(req,res, next){
    // Create regex to form case insensitive search
    var regex = new RegExp(["^", req.query.title, "$"].join(""),"i");
    if( req.query.title == null){
      return res.send({hasErrors : "True", titleGiven : "False"});
    }
    await Template.find({title : regex, isPublic : "True"}).then(function(templateList){
      return res.send(templateList);
    })
  
  })


  router.post('/rateTemplate',passport.authenticate('jwt', {session : false}), async function(req,res, next){
    // Check the TemplateID, Rating and UserID is given
    if( req.body.templateID == null){
      return res.send({hasErrors : "True", titleGiven : "False"});
    }
    if( req.body.rating == null){
        return res.send({hasErrors : "True", ratingGiven : "False"});
    }
    if(! (await fetchController.userIDExists(req.user.userID))){
        return res.send({hasErrors : "True", userExists : "False"});
    }
    console.log(req.user)
    var template = await Template.findOne({templateID : req.body.templateID})
    var updatedData = {}

    if(template == null){
        return res.send({hasErrors : "True", templateExists : "False"});
    }
    console.log(template)
    console.log(template.ratedUsers)
    if(template.ratedUsers.includes(req.user.userID)){
        return res.send({hasErrors : "True", ratingExists : "True"});
    }
    if(!([1,2,3,4,5].includes(parseInt(req.body.rating)))){
        return res.send({hasErrors : "True", invalidRating : "True"});
    }
    updatedData.ratingTotal = req.body.rating + template.ratingTotal;
    updatedData.ratedUsers = [...template.ratedUsers, req.user.userID]
    updatedData.rating = (updatedData.ratingTotal) / (updatedData.ratedUsers.length)
    console.log(updatedData.ratingTotal)
    console.log(updatedData.ratedUsers.length)
    
    await Template.findByIdAndUpdate({_id : template._id}, updatedData).then(function(){
        return res.send({hasErrors : "False", newRating : updatedData.rating})
    })

    
})
  

module.exports = router;