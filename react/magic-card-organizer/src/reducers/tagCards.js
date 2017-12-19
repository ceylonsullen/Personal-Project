import {
    GET_TAG_CARDS
} from '../actions';

export default (tagCards = [], action) => {
    switch (action.type) {
        case GET_TAG_CARDS:
            return action.payload
        default:
            return tagCards;
    }
};
