const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

// Register a new user
router.post("/", auth, async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Return error if user already registered
    let user = await User.findOne({ email: req.body.email});
    if (user) return res.status(400).send('User already registered');

    // Create new user
    // Salt and hash password to store in DB
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    

    try {
        // Generate auth token 
        await user.save();
        const token = user.generateAuthToken();

        // Set auth token as header
        res.header('x-auth-token', token).send(_.pick(user, [
            '_id',
            'name',
            'email'
        ]));
    } catch (e) {
        for (field in e.errors);
        console.error("ERROR ERROR: ", e.errors[field]);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});

router.get("/me", auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


module.exports = router;