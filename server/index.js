const config = require('config');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
};


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);


mongoose.connect('mongodb://localhost/vidlyex', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Error connecting to database', err)
    } else {
        console.log('Connected to database!')
    }
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on ${port}`)
});