const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');

const User = require('../models/dbschema/user');

// Login validation and Authentication
module.exports = function validateLoginInput(data) {
  let errors = {};

  // If field is not empty then empty it to work with validator
  data.emailAddress =  !isEmpty(data.emailAddress) ? data.emailAddress : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email Checks
  if (validator.isEmpty(data.emailAddress)) {
    errors.emailAddress = "Email field is required";
  } else if (!validator.isEmail(data.emailAddress)){
    errors.emailAddress = "Email is invalid";
  }

  // Password Checks
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

// Part 6 end of tutorial
