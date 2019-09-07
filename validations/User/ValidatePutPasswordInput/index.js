const _ = require('lodash');
const validator = require('validator');

const validatePostInput = async data => {
    let errors = {};

    data.password = _.get(data, 'password', '');
    data.verifyPassword = _.get(data, 'verifyPassword', '');
    data.newPassword = _.get(data, 'newPassword', '');

    // * Password
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!validator.isLength(data.password, { min: 3 })) {
        errors.password = 'Password at least 3 characters';
    }

    // * Verify password
    if (validator.isEmpty(data.verifyPassword)) {
        errors.verifyPassword = 'Verify password is required';
    } else if (!validator.equals(data.password, data.verifyPassword)) {
        errors.verifyPassword = 'Passwords must match';
    }

    // * New password
    if (validator.isEmpty(data.newPassword)) {
        errors.newPassword = 'New password is required';
    } else if (!validator.isLength(data.newPassword, { min: 3 })) {
        errors.newPassword = 'New password at least 3 characters';
    }

    return {
        isValid: _.isEmpty(errors),
        errors
    };
};

module.exports = validatePostInput;
