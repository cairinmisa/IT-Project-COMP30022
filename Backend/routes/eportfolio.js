const express = require("express");
const router = express.Router();
const passport = require('passport');

// Load controllers
const eportController = require('../controllers/eport');
const fetchController = require('../controllers/fetch');

// Load input validation
const validatenewEportInput = require('../controllers/validators/newEport');
const validatesaveEportInput = require('../controllers/validators/saveEport');



// Load User model
const Eportfolio = require("../models/dbschema/eportfolio");


const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

router.get('/', async (req, res,next)=> {
    eportlist = await fetchController.getAllEports(req,res,next);
    res.send(eportlist);
})

// Create a new Eportfolio
router.post('/create',passport.authenticate('jwt', {session : false}), (req, res)=> {

    if(req.body.userID==null){
        return res.send({userIDGiven : "False", hasErrors : "True"})
    }

    const { errors, isValid } = validatenewEportInput(req.body);
    // Check Validation
    if (!isValid) {
     return res.status(200).json(errors);
    }
    // Check user is modifying their own account
    if(!(req.user.userID == req.body.userID)){
        return res.send({unauthorizedAccess : "True", hasErrors : "True"})
      }
    eportController.register(req,res)
})

// Fetch Eportfolio from EportID
router.post('/fetch',passport.authenticate('jwt', {session : false}), (req, res)=> {

    if(req.body.eportID ==null){
        return res.send({eportGiven : "False", hasErrors : "True"})
    }
    eportController.fetchOne(req,res)
    
})

// Fetch Eportfolios from UserID
router.post('/userfetch',passport.authenticate('jwt', {session : false}), (req, res)=> {

    if(req.body.userID ==null){
        return res.send({userIDGiven : "False", hasErrors : "True"})
    }
    eportController.fetchAll(req,res)
})


// Delete Eportfolio from EportID
router.delete('/',passport.authenticate('jwt', {session : false}), (req, res)=> {

    if(req.body.eportID ==null){
        return res.send({eportGiven : "False", hasErrors : "True"})
    }
    eportController.delete(req,res)
    
})

// Save Eportfolio from EportID
router.put('/save',passport.authenticate('jwt', {session : false}), (req, res)=> {
    const { errors, isValid } = validatesaveEportInput(req.body);
    // Check Validation
    if (!isValid) {
    return res.status(200).json(errors);
    }

    eportController.saveEport(req,res)
})

// Fetches all public eportfolios from a user
router.get('/fetchPublic/',passport.authenticate('jwt', {session : false}),async (req, res)=> {
    
    // Checks the userID isn't null
    if(req.query.userID == null){
        return ({hasErrors : "True", userIDGiven : "False"})
    }
    // Checks if the user exists
    if(!(await fetchController.userIDExists(req.query.userID))){
        return res.send({hasErrors : "True", userExists : "False"})
    }
    // Returns the list of the correct folios
    Eportfolio.find({userID : req.query.userID, isPublic : "True"}).then(function (folios){
        res.send(folios);
    })

})

router.get('/searchByTitle', async function(req,res, next){

     // Create regex to form case insensitive search
     var regex = new RegExp(["^", req.query.title, "$"].join(""),"i");
    if( req.query.title == null){
      return res.send({hasErrors : "True", titleGiven : "False"});
    }
  
    await Eportfolio.find({title : regex, isPublic : "True"}).then(function(eportList){
      return res.send(eportList);
    })
  
  })

module.exports = router;