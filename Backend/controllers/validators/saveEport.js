const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');

const Eportfolio = require('../../models/dbschema/eportfolio');
const { error } = require('../error');

// Login validation and Authentication
module.exports = function validatesaveEportInput(data) {
  let errors = {};

  // If field is not empty then empty it to work with validator
  data.eportID =  !isEmpty(data.eportID) ? data.eportID : "";
  data.data = !isEmpty(data.data) ? data.data : "";
  data.dateUpdated = !isEmpty(data.dateUpdated) ? data.dateUpdated : "";
  
  // Field Checks
  if (validator.isEmpty(data.eportID)) {
    errors.eportIDGiven = "False";
  } else if (validator.isEmpty(data.data)){
    errors.dataGiven = "False";
  } else if (validator.isEmpty(data.dateUpdated)){
    errors.dateGiven = "False";
  }

  if (!isEmpty(errors)){
    errors.hasErrors = "True";
  } else {
    errors.hasErrors = "False";
  }

  return {
    errors,
    isValid: (errors.hasErrors == "False")
  };
}

