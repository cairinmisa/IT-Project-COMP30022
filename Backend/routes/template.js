const express = require("express");
const router = express.Router();
const passport = require('passport');

// Load controllers
const eportController = require('../controllers/eport');
const fetchController = require('../controllers/fetch');
const templateController = require('../controllers/template');

// Load input validation
const validatenewTemplateInput = require('../controllers/validators/newTemplate');

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

    templateController.register(req, res);
})

module.exports = router;