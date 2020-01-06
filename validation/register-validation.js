const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Name checks
  if (Validator.isEmpty(data.firstName)) {
    errors.error = 'Name field is required';
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.error = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    errors.error = 'Email is invalid';
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.error = 'Password field is required';
  }
  // if (Validator.isEmpty(data.password2)) {
  //   errors.password2 = 'Confirm password field is required';
  // }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.error = 'Password must be at least 6 characters';
  }
  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = 'Passwords must match';
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
