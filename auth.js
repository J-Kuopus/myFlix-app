const jwtSecret = 'your_jwt_secret'; // Same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Connects to local passport file

/**
 * creates JWT token (expires in 7 days, using HS256 algorithm to encode)
 * @param {object} user 
 * @returns user object, jwt, and additional information on token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, 
    expiresIn: '7d', 
    algorithm: 'HS256' 
  });
}

/* POST login */
/**
 * handles user login, generating a jwt token upon login
 * @function generateJWTToken
 * @param {*} router 
 * @returns user object with jwt
 * @requires passport
 */
module.exports = (router) => {
    router.post('/login', (req,res) => {
      passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right.',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req,res);
  });
  }