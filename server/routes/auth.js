const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require("joi");

// Login
router.post("/", async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Send a generic error message if the email or password are incorrect
    let user = await User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    // Use bcrypt to decode the hashed password, send generic error message if incorrect
    // validPassword is a Boolean
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    // Generate an jwt
    const token = user.generateAuthToken();

    // Send jwt
    res.send(token);
});

// Use Joi to validate user input
function validateAuth(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(req, schema);
};


module.exports = router;