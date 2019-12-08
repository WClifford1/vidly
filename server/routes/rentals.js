const express = require('express');
const router = express.Router();
const Fawn = require('fawn')
const mongoose = require('mongoose');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');

// Fawn does transaction in MongoDB -- Atomizes DB queries. Like MongoDB double commit.
Fawn.init(mongoose);

// Return all rentals sorted by descending dateOut
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

// Post new rental
router.post('/', auth, async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // DB query to get customer
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    // DB query to get movie
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    // Return if movies numberInStock = 0
    if (movie.numberInStock === 0 ) return res.status(400).send('Movie not in stock.')

    // Embedded customer and movie info
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });

    // Do Fawn Transaction -
    // Renting a movie will decrement the movie's numberInStock.
    // Only complete both actions.
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id}, {
                $inc: {
                    numberInStock: -1
                }
            })
            .run();
    
        res.send(rental);
    } catch (e) {
        return res.status(500).send('Something failed', e);
    };
});

module.exports = router;