const mongoose = require('mongoose');


mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;


const Tag = require('./Tag.js');

const Schema = mongoose.Schema;


const CardSchema = new Schema({
    layout: {
        type: String
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    manaCost: {
        type: String
    },
    cmc: {
        type: Number
    },
    colors: [{
        type: String
    }],
    type: {
        type: String
    },
    types: [{
        type: String
    }],
    text: {
        type: String
    },
    power: {
        type: String
    },
    toughness: {
        type: String
    },
    imageName: {
        type: String,
        required: true
    },
    colorIdentity: [{
        type: String,
    }]
});


module.exports = mongoose.model('Cards', CardSchema);