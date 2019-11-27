const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require("joi");
const jwt = require('jsonwebtoken');


router.post("/", async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassowrd = await bcrypt.compare(req.body.password, user.password);
    if (!validPassowrd) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');

    res.send(token);
});

function validateAuth(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(req, schema);
};


module.exports = router;