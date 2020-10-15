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
router.delete('/delete',passport.authenticate('jwt', {session : false}), (req, res)=> {
    // Validates the Template ID is provided
    if (req.body.templateID == null){
        return ({hasErrors : "True", templateIDGiven : "False"});
    }
    
    templateController.deleteTemplate(req,res)
})
// Fetch all public templates
router.get('/getPublic',async (req, res)=> {

    await Template.find({isPublic : "True"}).then(function(tempList){
        return res.send(tempList);
    })

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

module.exports = router;