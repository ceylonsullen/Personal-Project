import {
    GET_TAGS
} from '../actions';

export default (tags = [], action) => {
    switch (action.type) {
        case GET_TAGS:
            return action.payload
        default:
            return tags;
    }
};
