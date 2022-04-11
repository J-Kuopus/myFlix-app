// Imports Express framework
const express = require('express'),
  // Imports Morgan library
  morgan = require('morgan'),
  // Imports body-parser
  bodyParser = require('body-parser'),
  // Imports uuid
  uuid = require('uuid'),
  // Imports built-in node modules for fs and path
  fs = require('fs'),
  path = require('path');
// Defines app variable that accesses Express functions
const app = express();

// Creates write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join('log.txt'), {
  flags: 'a',
});

// Movie list array
let topMovies = [
  { title: 'The Wizard of Oz', director: 'Victor Fleming' },
  { title: 'Willy Wonka & the Chocolate Factory', director: 'Mel Stuart' },
  { title: 'Dawn of the Dead', director: 'George A. Romero' },
  { title: 'Videodrome', director: 'David Cronenberg' },
  { title: 'Phantasm', director: 'Don Coscarelli' },
  { title: 'Phenomena', director: 'Dario Argento' },
  { title: 'City of the Living Dead', director: 'Lucio Fulci' },
  { title: 'Hellraiser', director: 'Clive Barker' },
  { title: 'Prince of Darkness', director: 'John Carpenter' },
  { title: 'Paprika', director: 'Satoshi Kon' },
];

// Sets up logger
app.use(morgan('combined', { stream: accessLogStream }));

// Uses Morgan's logging methods
app.use(morgan('common'));

// Accesses all files in "public" folder
app.use(express.static('public'));

// GETS index.html page
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// GETS and returns movie array in JSON format
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error-handling function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listening function
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
