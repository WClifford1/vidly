const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { Movie, validateMovie } = require('../models/movie');


router.get("/", async (req, res) => {
    try {
        const movies = await Movie
            .find()
            .sort({ title: 1});
        console.log(movies);
        res.send(movies);
    } catch (e) {
        for (field in e.errors);
        console.error("ERROR ERROR: ", e.errors[field]);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});


router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        console.log(movie);
        res.send(movie);
    } catch (e) {
        console.log(e.message)
        res.send(e.message)
    };
});


router.post("/", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
    
    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });
    
    try {
        const result = await movie.save();
        console.log(result);
        res.send(result);
    } catch (e) {
        for (field in e.errors);
        console.error("ERROR ERROR: ", e.errors[field]);
        res.send("ERROR ERROR: ", e.errors[field]);
    };
});


router.put("/:id", async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    try {
        const movie = await Movie.findById(req.params.id);
        movie.title = req.body.title;
        movie.numberInStock = req.body.numberInStock;
        movie.dailyRentalRate = req.body.dailyRentalRate;
        movie.genre.id = genre._id;
        movie.genre.name = genre.name;
        movie.save();
        console.log(movie);
        res.send(movie);
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    };
});


router.delete("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        console.log(movie);
        res.send(movie);
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    };
});


module.exports = router;