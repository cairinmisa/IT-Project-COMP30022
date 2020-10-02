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
  console.log(data)
  // Convert empty fields to an empty string so we can use validator functions
  data.userID = !isEmpty(data.userID) ? data.userID : "";
  data.oldpassword = !isEmpty(data.oldpassword) ? data.oldpassword : "";
  data.oldpassword2 = !isEmpty(data.oldpassword2) ?data.oldpassword2 : "";
  console.log(data)
  // Implement the checks for
  // UserID Check
  if (validator.isEmpty(data.userID)) {
    errors.userIDGiven = "False";
  }
  // Password Checks
  if (validator.isEmpty(data.oldpassword)) {
    errors.oldpasswordGiven = "False";
  }

  if (validator.isEmpty(data.oldpassword2)) {
    errors.oldpassword2Given = "False";
  }

  if (!validator.equals(data.oldpassword, data.oldpassword2)) {
    errors.passwordMatch = "False";
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
