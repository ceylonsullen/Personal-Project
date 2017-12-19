const mongoose = require('mongoose');

mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;

const Schema = mongoose.Schema;


const DeckSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mainBoard: [{
        type: Schema.Types.ObjectId,
        ref: 'Cards'
    }],
    sideBoard: [{
        type: Schema.Types.ObjectId,
        ref: 'Cards'
    }],
    maybeBoard: [{
        type: Schema.Types.ObjectId,
        ref: 'Cards'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    user: {
        type: String
    }
});


module.exports = mongoose.model('Decks', DeckSchema);