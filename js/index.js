// Imports Mongoose package
const mongoose = require('mongoose');
const Models = require('./models.js');
// Imports Mongoose Models
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// Connects Mongooose to database for CRUD operations
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

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

// READS and returns list of ALL Movies in JSON format
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
  res.status(201).json(movies);
})
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err)
  });
});

// READS and returns details about ONE Movie in JSON format
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
  res.json(movie);
})
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
  });
});

// READS and returns details about ONE Movie Genre by name in JSON format
app.get('/genre/:Name', (req, res) => {
  Genres.findOne( { Name: req.params.Name })
  .then((genre) => {
  res.status(200).json(genre.Description);
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
  });
});

// READS and returns info about ONE director by name in JSON format
app.get('/director/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
  .then((director) => {
  res.status(200).json(director);
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error; ' + err);
  });
});

// CREATE, allows new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + ' already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user)})
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});
// UPDATE, allows users to update username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
  {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }
},
{ new: true }, //This line makes sure that the updated document is returned
(err, updatedUser) => {
  if (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
  });
});
// UPDATE, Allows users to add One Movie to their Favorites list
app.put('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  { $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
  if (err) {
  console.error(err);
  res.status(500).send('Error: ' + err);
  } else {
  res.json(updatedUser);
  }
  });
});

// DELETE, allows users to delete One Movie from their Favorites list
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((movie) => {
  if (!movie) {
  res.status(400).send(req.params.MovieID + ' was not found.');
  } else {
  res.status(200).send(req.params.MovieID + ' was deleted from favorites list.');
  }
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
  });
});

// DELETE, allows users to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
  if (!user) {
  res.status(400).send(req.params.Username + ' was not found.');
  } else {
  res.status(200).send(req.params.Username + ' was deleted.');
  }
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
  });
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
