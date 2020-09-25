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
module.exports = function validateupdateInput(data){
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.userID) ? data.userID : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ?data.password2 : "";
  // Implement the checks for
  // UserID Check
  if (validator.isEmpty(data.userID)) {
    errors.userIDGiven = "False";
  }
  // Password Checks
  if (validator.isEmpty(data.password)) {
    errors.passwordGiven = "False";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2Given = "False";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.passwordMatch = "False";
  }

  // Return errors if any. If not, return true if all is Valid
  if (!isEmpty(errors)){
    errors.hasError = "True";
  } else {
    errors.hasError = "False";
  }

  return {
    errors,
    isValid: (errors.hasError == "False")
  };
};
