const validator = require('validator');
const isEmpty = require('is-empty');
const bcrypt = require('bcryptjs');


// Login validation and Authentication
module.exports = function validateLoginInput(data) {
  let errors = {};

  // If field is not empty then empty it to work with validator
  data.emailAddress =  !isEmpty(data.emailAddress) ? data.emailAddress : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email Checks
  if (validator.isEmpty(data.emailAddress)) {
    errors.emailGiven = "False";
  } else if (!validator.isEmail(data.emailAddress)){
    errors.emailValid = "False";
  }

  // Password Checks
  if (validator.isEmpty(data.password)) {
    errors.passwordGiven = "False";
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

