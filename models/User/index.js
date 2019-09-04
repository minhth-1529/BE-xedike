const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    DOB: { type: String, required: true },
    userType: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    registerDate: { type: Date, default: Date.now() },
    avatar: {type: String},
    fullName: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema, 'User');

module.exports = {
    UserSchema,
    User
};
