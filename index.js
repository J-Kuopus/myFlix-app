// Imports Mongoose package
const mongoose = require('mongoose');
const Models = require('./models.js');

// Imports Mongoose Models
const Movies = Models.Movie;
const Users = Models.User;

// Imports Express framework
const express = require('express'),

// Imports Morgan library
morgan = require('morgan'),

// Imports body-parser
bodyParser = require('body-parser');

// Defines app variable that accesses Express functions
const app = express();

// Imports express-validator library
const { check, validationResult } = require('express-validator');

// Accesses all files in "public" folder
app.use(express.static('public'));

// Accesses body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Imports CORS module for allowing cross-origin domain access
const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 
                      'http://localhost:1234', 
                      'http://localhost:4200',
                      'http://localhost:3000', 
                      'https://powerful-coast-48240.herokuapp.com/',
                      'https://j-kuopus.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// Imports "auth.js" file. (app) ensures that Express is available in "auth.js".
let auth = require('./auth')(app);

// Imports "passport.js" file
const passport = require('passport');
require('./passport');

mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * GET: Returns welcome message for '/' request URL
 * @namespace mainPage
 * @param '/' endpoint
 * @returns Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});


/**
 * GET: Returns a list of ALL movies to the user
 * Request body: Bearer token
 * @namespace moviesEndpoint
 * @param '/movies' endpoint
 * @returns array of movie objects in JSON format
 * @requires passport
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + err);
      });
  }
);


/**
 * GET: Returns data about a single movie by title to the user
 * Request body: Bearer token
 * @param Title
 * @returns movie object in JSON format
 * @requires passport
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        if (movie) {
          res.status(200).json(movie);
        } else {
          res.status(400).send('Movie not found.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);


/**
 * GET: Returns data about movie genre (description) by name (e.g. "Horror")
 * Request body: Bearer token
 * @param Name (of genre)
 * @returns genre object in JSON format
 * @requires passport
 */
app.get(
  '/genre/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movie) => {
        if (movie) {
          res.json(movie.Genre);
        } else {
          res.status(400).send('Genre not found.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);


/**
 * GET: Returns data about a director (bio, birth year, death year) by name
 * Request body: Bearer token
 * @param Name (of director)
 * @returns director object in JSON format
 * @requires passport
 */
app.get(
  '/director/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
        if (movie) {
          res.status(200).json(movie.Director);
        } else {
          res.status(400).send('Director not found.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error; ' + err);
      });
  }
);


/**
 * POST: Allows new users to register; Username, Password & Email are required fields
 * Request body: Bearer token, JSON with user information
 * @param '/users' endpoint
 * @returns user object in JSON format
 */
app.post('/users', 
// Validation logic here for request
  [
    check('Username', 'Username is required.').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ],
  (req, res) => {

    // Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if user with requested username already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists'); //If user already exists, send response
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


/**
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates in JSON format
 * @requires passport
 */
app.put(
  '/users/:Username',
  [
    check('Username', 'Username is required.').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
  ],
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    // Check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, //This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);


/**
 * GET: Returns data on a single user by username
 * Request body: Bearer token
 * @param Username
 * @returns user object in JSON format
 * @requires passport
 */
app.get('/users/:Username',  
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then ((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});


/**
 * POST: Allows users to add a movie to their list of favorites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns user object in JSON format
 * @requires passport
 */
app.put(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);


/**
 * GET: Returns a list of favorite movies from the user
 * Request body: Bearer token
 * @param Username
 * @returns array of favorite movies in JSON format
 * @requires passport
 */
app.get(
  '/users/:Username/movies', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
  Users.findOne({ Username: req.params.Username })
      .then((user) => {
          if (user) { // If a user with the corresponding username was found, return user info
              res.status(200).json(user.FavoriteMovies);
          } else {
              res.status(400).send('Could not find favorite movies for this user');
          };
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


/**
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object in JSON format
 * @requires passport
 */
app.delete(
  '/users/:Username/movies/:MovieID', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, // Find user by username
      { $pull: { FavoriteMovies: req.params.MovieID } }, // Remove movie from the list
      { new: true }) // Return the updated document
      .then((updatedUser) => {
          res.json(updatedUser); // Return json object of updatedUser
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


/**
 * DELETE: Allows existing users to delete their account
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);


/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


/**
 * Port listening function
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
