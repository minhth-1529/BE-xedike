const { User } = require('../../../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validatePostInput = require('../../../validations/User/ValidatePostInput');
const ValidatePutPersonalInput = require('../../../validations/User/ValidatePutPersonalInput');
const ValidatePutPasswordInput = require('../../../validations/User/ValidatePutPasswordInput');

// * Get user list
module.exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.json(err));
};

// * Add new user
module.exports.createUser = async (req, res, next) => {
    const { email, password, DOB, userType, phoneNumber, fullName } = req.body;
    const { errors, isValid } = await validatePostInput(req.body);

    if (!isValid) return res.status(400).json(errors);

    const newUser = new User({
        email,
        password,
        DOB,
        userType,
        phoneNumber,
        fullName
    });

    bcryptjs.genSalt(10, (err, salt) => {
        if (err) return res.json(err);
        bcryptjs.hash(password, salt, (err, hash) => {
            if (err) return res.json(err);
            newUser.password = hash;

            newUser
                .save()
                .then(user => {
                    res.status(200).json({
                        user,
                        statusText: 'Register successfully!'
                    });
                })
                .catch(err => res.json(err));
        });
    });
};

// * Get user detail
module.exports.getDetailUser = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 404,
                    message: 'User not found'
                });

            res.status(200).json(user);
        })
        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });
};

// * Update user
// module.exports.updateUser = async (req, res, next) => {
//     const { id } = req.params;
//     const { errors, isValid } = await ValidatePutPersonalInput(req.body);
//     const { password, newPassword } = req.body;

//     User.findById(id)
//         .then(user => {
//             Object.keys(req.body).forEach(field => {
//                 user[field] = req.body[field];
//             });

//             if (!isValid) return res.status(400).json(errors);

//             bcryptjs.compare(password, user.password, (err, isMatch) => {
//                 if (!isMatch)
//                     return res.status(404).json('Password is incorrect!');

//                 bcryptjs.genSalt(10, (err, salt) => {
//                     if (err) return res.json(err);
//                     bcryptjs.hash(newPassword, salt, (err, hash) => {
//                         if (err) return res.json(err);

//                         user.password = hash;

//                         user.save()
//                             .then(user => {
//                                 res.status(204).json(user);
//                             })
//                             .catch(err => res.json(err));
//                     });
//                 });
//             });
//         })
//         .catch(err => {
//             if (!err.status) return res.json(err);

//             res.status(err.status).json(err.message);
//         });
// };

module.exports.updatePasswordUser = async (req, res) => {
    const { id } = req.params;
    const { errors, isValid } = await ValidatePutPasswordInput(req.body);
    const { password } = req.body;

    User.findById(id)
        .then(user => {
            if (!isValid) return res.status(400).json(errors);

            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (!isMatch)
                    return res.status(404).json('Password is incorrect!');

                bcryptjs.genSalt(10, (err, salt) => {
                    if (err) return res.json(err);
                    bcryptjs.hash(newPassword, salt, (err, hash) => {
                        if (err) return res.json(err);
                        user.password = hash;

                        user.save()
                            .then(user => {
                                res.status(204).json(user);
                            })
                            .catch(err => res.json(err));
                    });
                });
            });
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

module.exports.updatePersonalUser = async (req, res) => {
    const { id } = req.params;
    const { errors, isValid } = await ValidatePutPersonalInput(req.body);

    User.findById(id)
        .then(user => {
            if (!isValid) return res.status(400).json(errors);

            Object.keys(req.body).forEach(field => {
                user[field] = req.body[field];
            });

            user.save()
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err => res.json(err));
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

// * Delete user
module.exports.deleteUser = (req, res, next) => {
    const { id } = req.params;

    User.deleteOne({ _id: id })
        .then(result => res.status(200).json(result))
        .catch(err => res.json(err));
};

// * Login
module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 404,
                    message: 'Wrong email or password'
                });

            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (!isMatch)
                    return res.status(404).json('Wrong email or password');

                const payload = {
                    email: user.email,
                    userType: user.userType,
                    id: user._id,
                    fullName: user.fullName
                };

                jwt.sign(
                    payload,
                    'XEDIKE',
                    {
                        expiresIn: 3600
                    },
                    (err, token) => {
                        if (err) res.json(err);

                        res.status(200).json({
                            success: true,
                            token,
                            message: 'Login successfully!'
                        });
                    }
                );
            });
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

// * Upload avatar user
module.exports.uploadAvatar = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 404,
                    message: 'user not found'
                });

            user.avatar = req.file.path;

            return user.save();
        })
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(200).json({ message: err.message });
        });
};
