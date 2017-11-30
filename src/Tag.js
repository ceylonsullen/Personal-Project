const mongoose = require('mongoose');

mongoose.models = {};
mongoose.modelSchemas = {};



mongoose.Promise = Promise;

const Card = require('./Card.js');


const Schema = mongoose.Schema;


const TagSchema = new Schema({
    tag: {
        type: String,
        required: true
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Cards',
    }],
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Decks'
    }],
    user: {
        type: String
    }
});


module.exports = mongoose.model('Tags', TagSchema);