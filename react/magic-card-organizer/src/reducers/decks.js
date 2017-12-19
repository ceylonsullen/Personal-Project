import {
    GET_DECKS
} from '../actions';

export default (decks = {}, action) => {
    switch (action.type) {
        case GET_DECKS:
            console.log('payload', action.payload)
            return action.payload
        default:
            return decks;
    }
};