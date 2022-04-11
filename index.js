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

// User list array
let users = [];
// Movie list array
let movies = [
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

// Accesses body-parser
app.use(bodyParser.json());

// GETS index.html page
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// GETS and returns movie array in JSON format
app.get('/movies', (req, res) => {
  res.json(movies);
});
// GETS and returns details about movie in JSON format
app.get('/movies/[data]', (req, res) => {
  res.json(movieData);
});
// GETS and returns info about movie genre by genre name in JSON format
app.get('/movies/genres/[genre-name]', (req, res) => {
  res.json(movieGenres);
});
// GETS and returns movie directors by name in JSON format
app.get('/directors/[name]', (req, res) => {
  res.json(directors);
});
// Allows new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});
// Allows users to update username
app.put('/users/[username]', (req, res) => {
  const message = 'You updated your user name.';
  res.status(200).send(message);
});

// Allows users to add a movie to favorites list
app.put('/users/favorites', (req, res) => {
  const message = 'You added this movie to your favorites.';
  res.status(200).send(message);
});

// Allows users to remove movie from favorites list
app.delete('/users/favorites', (req, res) => {
  const message = 'You deleted this movie from your favorites.';
  res.status(204).send(message);
});

// Allows users to deregister (delete their profile)
app.delete('users/:id', (req, res) => {
  let user = users.find((user) => {
    return user.id === req.params.id;
  });
  if (user) {
    users = users.filter((obj) => {
      return obj.id !== req.params.id;
    });
    res.status(201).send('User ' + req.params.id + ' was deleted.');
  }
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
