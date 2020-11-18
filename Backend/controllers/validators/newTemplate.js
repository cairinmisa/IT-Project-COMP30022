const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');


// Login validation and Authentication
module.exports = function validatenewEportInput(data) {
  let errors = {};

  // If field is not empty then empty it to work with validator
  data.userID =  !isEmpty(data.userID) ? data.userID : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.dateCreated = !isEmpty(data.dateCreated) ? data.dateCreated : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.eportID = !isEmpty(data.eportID) ? data.eportID : "";
  
  // Email Checks
  if (validator.isEmpty(data.title)) {
    errors.titleGiven = "False";
  } else if (validator.isEmpty(data.userID)){
    errors.userIDGiven = "False";
  } else if (validator.isEmpty(data.dateCreated)){
    errors.dateGiven = "False";
  } else if (validator.isEmpty(data.category)){
    errors.categoryGiven = "False";
  } else if (validator.isEmpty(String(data.eportID))){
    errors.eportIDGiven = "False";
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

