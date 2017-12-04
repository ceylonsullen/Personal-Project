import {
    GET_CARD
} from '../actions';

export default (card = {}, action) => {
    switch (action.type) {
        case GET_CARD:
            console.log('payload', action.payload)
            return action.payload
        default:
            return card;
    }
};