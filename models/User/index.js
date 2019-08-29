const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: { type: String, required: true },
    DOB: { type: Date },
    userType: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    registerDate: { type: Date, default: Date.now() },
    avatar: {type: String},
    fullName: String
});

const User = mongoose.model('User', UserSchema, 'User');

module.exports = {
    UserSchema,
    User
};
