const mongoose = require('mongoose');
const Joi = require("joi");
const config = require('config');
const jwt = require('jsonwebtoken');

// User schema for MongoDB users collection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean
    }
});

// Add a method to the userschema to generate a jwt
// The config.get('jwtPrivateKey') is an environment variable
// The jwt payload has the user's _id
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};


const User = mongoose.model('User', userSchema);

// Use Joi to validate user input
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
};

exports.User = User;
exports.validateUser = validateUser;
