const express = require('express');
const router = express.Router();
const { Customer, validateCustomer } = require('../models/customer')


router.get("/", async (req, res) => {
    try {
        const customers = await Customer
            .find()
            .sort({ name: 1});
        console.log(customers);
        res.send(customers);
    } catch (e) {
        for (field in e.errors);
        console.error("ERROR ERROR: ", e.errors[field]);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});


router.get("/:id", async (req, res) => {
    try {
        const customer = await customer.findById(req.params.id);
        console.log(customer);
        res.send(customer);
    } catch (e) {
        console.log(e.message)
        res.send(e.message)
    };
});


router.post("/", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    
    try {
        const result = await customer.save();
        console.log(result);
        res.send(result);
    } catch (e) {
        for (field in e.errors);
        console.error("ERROR ERROR: ", e.errors[field]);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});


router.put("/:id", async (req, res) => {
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
        console.log(customer);
        res.send(customer);
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        console.log(customer);
        res.send(customer);
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    };
});


module.exports = router;