const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');

const User = require('../../models/dbschema/user');
const { error } = require('../error');

// Login validation and Authentication
module.exports = function validateDeleteInput(data) {
  let errors = {};

  // If field is not empty then empty it to work with validator
  data.emailAddress =  !isEmpty(data.emailAddress) ? data.emailAddress : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Email Check
  if (validator.isEmpty(data.emailAddress)) {
    errors.emailGiven = "False";
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

