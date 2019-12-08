const express = require('express');
const error = require('./middleware/error');
const app = express();
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

// Close app if jwtPrivateKey env variable has not been set
// If evn var is not set then auth function cannot function
// therefore close app
if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
};

// A method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(express.json());

// API endpoints
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

// MongoDB connection string
mongoose.connect('mongodb://localhost/vidlyex', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Error connecting to database', err)
    } else {
        console.log('Connected to database!')
    }
});

// Port number for server. Set to env variable or 3000
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Listening on ${port}`)
});