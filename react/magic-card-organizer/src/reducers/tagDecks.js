import {
    GET_TAG_DECKS
} from '../actions';

export default (tagDecks = [], action) => {
    switch (action.type) {
        case GET_TAG_DECKS:
            return action.payload
        default:
            return tagDecks;
    }
};
