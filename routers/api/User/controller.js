const { User } = require('../../../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validatePostInput = require('../../../validations/User/ValidatePostInput');

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
module.exports.updateUser = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 404,
                    message: 'User not found'
                });

            Object.keys(req.body).forEach(field => {
                user[field] = req.body[field];
            });

            bcryptjs.genSalt(10, (err, salt) => {
                if (err) return res.json(err);
                bcryptjs.hash(user.password, salt, (err, hash) => {
                    if (err) return res.json(err);
                    user.password = hash;

                    user.save()
                        .then(user => {
                            res.status(200).json(user);
                        })
                        .catch(err => res.json(err));
                });
            });
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
                    id: user._id
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
                            statusText: 'Login successfully!'
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

// * Update avatar user
module.exports.uploadAvatar = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 404,
                    message: 'User not found'
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