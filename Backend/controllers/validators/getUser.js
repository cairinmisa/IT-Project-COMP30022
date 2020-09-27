const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');

const User = require('../../models/dbschema/user');

// vi. Setting up form Validation
// export function validateRegisterInput, which takes in data as a parameter (sent from frontend registration form)
// Instantiate errors object
// convert all empty fields to an empty string before running Validation
// check for empty fields, valid email formats, password requirements, and confirm password equality using validator functions
// return our errors object with any and all errors contained as well as an isValid boolean that checks to see if we have any errors

// Registration Validation and Authentication
module.exports = function validategetUserInput(data){
  let errors = {};

  data.emailAddress = !isEmpty(data.emailAddress) ? data.emailAddress : "";

  // Implement the checks for

  // Email Check
  if (validator.isEmpty(data.emailAddress)) {
    errors.emailGiven = "False";
  }
 
  // Return errors if any. If not, return true if all is Valid
  if (!isEmpty(errors)){
    errors.hasErrors = "True";
  } else {
    errors.hasErrors = "False";
  }

  return {
    errors,
    isValid: (errors.hasErrors == "False")
  };
};
