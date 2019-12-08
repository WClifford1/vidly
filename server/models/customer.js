const mongoose = require('mongoose');
const Joi = require("joi");

// Mongoose schema for customers collection
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

// Use Joi to validate user input
function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50).required(),
    };
    return Joi.validate(customer, schema)
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
