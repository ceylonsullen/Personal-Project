const fs = require('fs');

const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/so-posts', { useMongoClient: true });

let savedCards = null;

const Card = require('./Card.js');

const readCards = () => {
  if (!savedCards) {
    const contents = fs.readFileSync('AllCards.json/AllCards.json', 'utf8');
    savedCards = JSON.parse(contents);
  }
  return savedCards;
};

const populateCards = () => {
  // TODO: implement this
  readCards();
  const promises = Object.values(savedCards).map((element) => {
    return new Card(element).save();
  });
  console.log('done')
  return Promise.all(promises);
};
populateCards();
console.log('done2')
module.exports = { readCards, populateCards };