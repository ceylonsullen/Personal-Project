const mongoose = require('mongoose');

mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    // email: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Cards'
    }],
    tags: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Decks'
    }]
});


module.exports = mongoose.model('Users', UserSchema);