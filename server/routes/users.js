const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');


router.post("/", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    try {
        await user.save();

        res.send(_.pick(user, [
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


module.exports = router;