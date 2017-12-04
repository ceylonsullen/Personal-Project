import {
    GET_CARDS
} from '../actions';

export default (cards = [], action) => {
    switch (action.type) {
        case GET_CARDS:
            console.log("new cards", action.payload)
            return action.payload
        default:
            return cards;
    }
};
