const express = require('express');
const app = express();

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

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
