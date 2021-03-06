const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all genres
router.get("/", async (req, res, next) => {
    try {
        const genres = await Genre
            .find()
            .sort({ name: 1});
        console.log(genres);
        res.send(genres);
    } catch (e) {
        next(e);
    };
});

// Get single genre by id
router.get("/:id", async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        console.log(genre);
        res.send(genre);
    } catch (e) {
        res.send(e.message)
    };
});

// Post new genre
router.post("/", auth, async (req, res) => {

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = new Genre({
        name: req.body.name
    });
    
    try {
        const result = await genre.save();
        console.log(result);
        res.send(result);
    } catch (e) {
        for (field in e.errors);
        console.error("ERROR ERROR: ", e.errors[field]);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});

// Edit genre by id
router.put("/:id", auth, async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true
        });
        console.log(genre);
        res.send(genre);
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    }
});

// Remove genre by id
router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        console.log(genre);
        res.send(genre);
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    };
});


module.exports = router;