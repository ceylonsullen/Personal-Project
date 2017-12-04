import {
    GET_DECK_CARDS
} from '../actions';

export default (deckCards = [], action) => {
    switch (action.type) {
        case GET_DECK_CARDS:
            return action.payload
        default:
            return deckCards;
    }
};
