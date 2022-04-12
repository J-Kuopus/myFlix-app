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
let users = [
  { userId: 1, name: 'Malakai', favoriteMovies: ['Phantasm', 'Hellraiser'] },
  { userId: 2, name: 'Lucy', favoriteMovies: [] },
];
// Movie list array
let movies = [
  {
    Title: 'The Wizard of Oz',
    Director: { Name: 'Victor Fleming' },
    Genre: {
      Name: 'Fantasy',
      Description:
        'The fantasy genre is defined by both circumstance and setting inside a fictional universe with an unrealistic set of natural laws.',
    },
  },
  {
    Title: 'Willy Wonka & the Chocolate Factory',
    Director: { Name: 'Mel Stuart' },
    Genre: {
      Name: 'Fantasy',
      Description:
        'The fantasy genre is defined by both circumstance and setting inside a fictional universe with an unrealistic set of natural laws.',
    },
  },
  {
    Title: 'Dawn of the Dead',
    Director: { Name: 'George A. Romero' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Videodrome',
    Director: { Name: 'David Cronenberg' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Phantasm',
    Director: { Name: 'Don Coscarelli' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Phenomena',
    Director: { Name: 'Dario Argento' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'City of the Living Dead',
    Director: { Name: 'Lucio Fulci' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Hellraiser',
    Director: { Name: 'Clive Barker' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Prince of Darkness',
    Director: { Name: 'John Carpenter' },
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Paprika',
    Director: { Name: 'Satoshi Kon' },
    Genre: {
      Name: 'Fantasy',
      Description:
        'The fantasy genre is defined by both circumstance and setting inside a fictional universe with an unrealistic set of natural laws.',
    },
  },
];

// Sets up logger
app.use(morgan('combined', { stream: accessLogStream }));

// Uses Morgan's logging methods
app.use(morgan('common'));

// Accesses all files in "public" folder
app.use(express.static('public'));

// Accesses body-parser
app.use(bodyParser.json());

// READS index.html page
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// READS and returns movie array in JSON format
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});
// READS and returns details about movie in JSON format
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('This movie was not found.');
  }
});
// READS and returns details about movie genres in JSON format
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('This genre was not found.');
  }
});
// READS and returns movie directors by name in JSON format
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('This director was not found.');
  }
});
// CREATE, allows new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.userId = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('Users need names!');
  }
});
// UPDATE, allows users to update username
app.put('/users/:userId', (req, res) => {
  const { userId } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.userId == userId);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No such user exists.');
  }
});
// UPDATE, allows users to add movies to favorites list
app.put('/users/:userId/favoriteMovies/:movieTitle', (req, res) => {
  const { userId, movieTitle } = req.params;

  let user = users.find((user) => user.userId == userId);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been added to user ${userId}'s favorites list`);
  } else {
    res.status(400).send('No such user exists.');
  }
});
// DELETE, allows users to delete favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('No such user exists.');
  }
});
// DELETE, allows users to deregister (delete their profile)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('No such user exists.');
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
