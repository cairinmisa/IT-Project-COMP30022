const validator = require('validator');
const isEmpty = require('is-empty');
const isValidBirthdate = require('is-valid-birthdate')
const bcrypt = require('bcryptjs');

const User = require('../../models/dbschema/user');

// vi. Setting up form Validation
// export function validateRegisterInput, which takes in data as a parameter (sent from frontend registration form)
// Instantiate errors object
// convert all empty fields to an empty string before running Validation
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
  data.dOB = !isEmpty(data.dOB) ? data.dOB : "";

  // Implement the checks for
  // UserName Check
  if (validator.isEmpty(data.username)) {
    errors.usernameGiven = "False";
  }

  // Email Check
  if (validator.isEmpty(data.emailAddress)) {
    errors.emailGiven = "False";
  } else if (!validator.isEmail(data.emailAddress)) {
    errors.emailValid = "False";
  }

  // First Name Check
  if (validator.isEmpty(data.firstName)) {
    errors.firstnameGiven = "False";
  }
  // Last Name Check
  if (validator.isEmpty(data.lastName)) {
    errors.lastnameGiven = "False";
  }

  // Password Checks
  if (validator.isEmpty(data.password)) {
    errors.passwordGiven = "False";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2Given = "False";
  }

  if (!validator.isLength(data.password, { min: 6, max: 20})) {
    errors.passwordLength= "False";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.passwordMatch = "False";
  }

  if (!isValidBirthdate(data.dOB, {minAge: 18})) {
    errors.legalAge = "False";
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
