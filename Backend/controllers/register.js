const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');

const User = require('../models/dbschema/user');

// vi. Setting up form Validation
// export function validateRegisterInput, which takes in data as a parameter (sent from frontend registration form)
// Instantiate errors object
// convert all empty fiels to an empty string before running Validation
// check for empty fields, valid email formats, password requirements, and confirm password equality using validator functions
// return our errors object with any and all errors contained as well as an isValid boolean that checks to see if we have any errors

// Registration Validation and Authentication
module.exports = function validateRegisterInput(data){
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Second time writing out password when registering
  data.password2 = !isEmpty(data.password2) ?data.password2 : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.emailAddress = !isEmpty(data.emailAddress) ? data.emailAddress : "";

  // Implement the checks for
  // UserName Check
  if (validator.isEmpty(data.username)) {
    errors.username = "The username field is required";
  }

  // Email Check
  if (validator.isEmpty(data.emailAddress)) {
    errors.emailAddress = "the e-mail field is required";
  } else if (!validator.isEmail(data.emailAddress)) {
    errors.emailAddress = "The e-mail you put in is invalid";
  }

  // First Name Check
  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "the First Name field is required";
  }
  // Last Name Check
  if (validator.isEmpty(data.lastName)) {
    errors.lastName = "the Last Name field is required";
  }

  // Password Checks
  if (validator.isEmpty(data.password)) {
    errors.password = "the Password field is required";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 20})) {
    errors.password= "Password must be at least 6 to 20 characters";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "The Passwords must match";
  }


  // Return errors if any. If not, return true if all is Valid
  // (There is nothing in Errors)
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
