const express = require('express');
const router = express.Router();
const { Customer, validateCustomer } = require('../models/customer')
const auth = require('../middleware/auth');

// Return all customers in DB, sorted by name
router.get("/", async (req, res) => {
    try {
        const customers = await Customer
            .find()
            .sort({ name: 1});
        res.send(customers);
    } catch (e) {
        for (field in e.errors);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});

// Return one customer from their _id
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.send(customer);
    } catch (e) {
        res.status(404).send(e.message)
    };
});

// Create new customer in DB
// validateCustomer() function validates user input
// Customer schema validates what goes into DB
router.post("/", auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    
    try {
        const result = await customer.save();
        res.send(result);
    } catch (e) {
        for (field in e.errors);
        res.status(404).send("ERROR ERROR: ", e.errors[field]);
    };
});

// Edit customer in DB by their _id
// validateCustomer() function validates user input
// Customer schema validates what goes into DB
router.put("/:id", auth, async (req, res) => {
    const { error } = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, { 
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, {
            new: true
        });
        res.send(customer);
    } catch (e) {
        res.status(404).send(e.message);
    };
});


// Remove customer from DB from their _id
router.delete("/:id", auth, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        res.send(customer);
    } catch (e) {
        res.status(404).send(e.message);
    };
});


module.exports = router;