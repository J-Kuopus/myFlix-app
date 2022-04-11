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
  {
    Title: 'The Wizard of Oz',
    Director: 'Victor Fleming',
    Genre: {
      Name: 'Fantasy',
      Description:
        'The fantasy genre is defined by both circumstance and setting inside a fictional universe with an unrealistic set of natural laws.',
    },
  },
  {
    Title: 'Willy Wonka & the Chocolate Factory',
    Director: 'Mel Stuart',
    Genre: {
      Name: 'Fantasy',
      Description:
        'The fantasy genre is defined by both circumstance and setting inside a fictional universe with an unrealistic set of natural laws.',
    },
  },
  {
    Title: 'Dawn of the Dead',
    Director: 'George A. Romero',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Videodrome',
    Director: 'David Cronenberg',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Phantasm',
    Director: 'Don Coscarelli',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Phenomena',
    Director: 'Dario Argento',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'City of the Living Dead',
    Director: 'Lucio Fulci',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Hellraiser',
    Director: 'Clive Barker',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Prince of Darkness',
    Director: 'John Carpenter',
    Genre: {
      Name: 'Horror',
      Description:
        'The horror genre is centered upon depicting terrifying or macabre events for the sake of entertainment.',
    },
  },
  {
    Title: 'Paprika',
    Director: 'Satoshi Kon',
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

// GETS index.html page
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// GETS and returns movie array in JSON format
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});
// GETS and returns details about movie in JSON format
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('This movie was not found.');
  }
});
// GETS and returns details about movie genres in JSON format
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('This genre was not found.');
  }
});
// GETS and returns movie directors by name in JSON format
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
