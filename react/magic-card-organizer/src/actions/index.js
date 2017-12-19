import axios from 'axios';
axios.defaults.withCredentials = true;
const ROOT_URL = 'http://localhost:3030';

export const GET_DECKS = 'GET_DECKS';
export const GET_CARDS = 'GET_CARDS';
export const GET_DECK_CARDS = 'GET_DECK_CARDS';
export const GET_TAG_CARDS = 'GET_TAG_CARDS';
export const GET_TAG_DECKS = 'GET_TAG_DECKS';
export const GET_TAGS = 'GET_TAGS';
export const GET_CARD = 'GET_CARD';
export const USER_REGISTERED = 'USER_REGISTERED';
export const USER_AUTHENTICATED = 'USER_AUTHENTICATED';
export const USER_UNAUTHENTICATED = 'USER_UNAUTHENTICATED';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const CHECK_IF_AUTHENTICATED = 'CHECK_IF_AUTHENTICATED';

export const authError = error => {
    return {
        type: AUTHENTICATION_ERROR,
        payload: error
    };
};

const runMultipleFunctions = (...args) => {
    args.forEach(cb => cb());
}

export const register = (username, password, confirmPassword, history) => {
    console.log(username, password, confirmPassword, history)
    return dispatch => {
        if (password !== confirmPassword) {
            dispatch(authError('Passwords do not match'));
            return;
        }
        axios
            .post(`${ROOT_URL}/users`, { username, password })
            .then(() => {
            dispatch({
                type: USER_REGISTERED
            });
            history.push('/signin');
            })
            .catch(() => {
            dispatch(authError('Failed to register user'));
            });
    };
};
export const login = (username, password, history) => {
    return dispatch => {
    axios
        .post(`${ROOT_URL}/login`, { username, password })
        .then(() => {
        dispatch({
            type: USER_AUTHENTICATED
        });
        history.push('/usercardbase');
        })
        .catch(() => {
        dispatch(authError('Incorrect email/password combo'));
        });
    };
};

export const logout = () => {
    return dispatch => {
    axios
        .post(`${ROOT_URL}/logout`)
        .then(() => {
        dispatch({
            type: USER_UNAUTHENTICATED
        });
        })
        .catch(() => {
        dispatch(authError('Failed to log you out'));
        });
    };
};

export const getDecks = () => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/decks`)
            .then((decks) => {
                console.log("decks", decks.data)
                authError(null)
                dispatch({
                    type: GET_DECKS,
                    payload: decks.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get decks'));
            });
        };
}

export const getCards = () => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/cards`)
            .then((cards) => {
                console.log(cards.data)
                dispatch({
                    type: GET_CARDS,
                    payload: cards.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get cards'));
            });
        };
}

export const getDeckTags = (deckName) => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/deck/get/${deckName}/tags`)
            .then((cards) => { // todo : make a deck tags state
                console.log(cards.data)
                dispatch(getDecks());
            })
            .catch(() => {
            dispatch(authError('Failed to get cards'));
            });
        };
}

export const getDeckCards = (deckName) => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/deck/get/${deckName}/cards`)
            .then((cards) => {
                console.log(cards.data)
                dispatch({
                    type: GET_DECK_CARDS,
                    payload: cards.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get cards'));
            });
        };
}


export const getTags = () => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/tags`)
            .then((tags) => {
                dispatch({
                    type: GET_TAGS,
                    payload: tags.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get tags'));
            });
        };
}

export const getTagCards = (tagName) => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/tag/get/${tagName}/cards`)
            .then((cards) => {
                console.log(cards.data)
                dispatch({
                    type: GET_TAG_CARDS,
                    payload: cards.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get cards'));
            });
        };
}

export const getTagDecks = (tagName) => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/user/tag/get/${tagName}/decks`)
            .then((decks) => { // todo : make a tagdecks state
                console.log(decks.data)
                dispatch({
                    type: GET_TAG_DECKS,
                    payload: decks.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get decks'));
            });
        };
}

export const getCard = (cardName) => {
    return dispatch => {
        axios
            .get(`${ROOT_URL}/cardsearch/${cardName}`)
            .then((card) => {
                dispatch({
                    type: GET_CARD,
                    payload: card.data
                });
            })
            .catch(() => {
            dispatch(authError('Failed to get card'));
            });
        };
}


export const addToCards = (name) => {
    return dispatch => {
        axios
            .post(`${ROOT_URL}/user/card/post/add`, { name: name })
            .then(() => {
                dispatch(getCards())
            })
            .catch(() => {
            dispatch(authError('Failed to get card'));
            });
        };
}
export const addDeck = (name) => {
    return dispatch => {
        axios
            .post(`${ROOT_URL}/user/deck/post/add`, { name: name })
            .then(() => {
                dispatch(getDecks())
            })
            .catch(() => {
            dispatch(authError('Failed to add deck'));
            });
        };
}

export const addCardToDeck = (name, cardName, place) => {
    return dispatch => {
        axios
            .put(`${ROOT_URL}/user/deck/post/card`, { name: name, place: place, cardName: cardName })
            .then(() => {
                dispatch(getDecks())
            })
            .catch(() => {
            dispatch(authError('Failed to add deck'));
            });
        };
}

export const addTagToDeck = (name, tag) => {
    return dispatch => {
        axios
            .put(`${ROOT_URL}/user/deck/post/tag`, { name: name, tag: tag })
            .then(() => {
                dispatch(getTags())
            })
            .catch(() => {
            dispatch(authError('Failed to add deck'));
            });
        };
}

export const addTag = (name) => {
    return dispatch => {
        axios
            .post(`${ROOT_URL}/user/tag/post/add`, { tag: name })
            .then(() => {
                dispatch(getTags())
            })
            .catch(() => {
            dispatch(authError('Failed to add tag'));
            });
        };
}

export const addDeckToTag = (tag, name) => {
    return dispatch => {
        axios
            .put(`${ROOT_URL}/user/tag/post/deck`, { tag: tag, name: name })
            .then(() => {
                dispatch(getTags())
            })
            .catch(() => {
            dispatch(authError('Failed to add tag'));
            });
        };
}

export const addCardToTag = (name, tag) => {
    return dispatch => {
        axios
            .put(`${ROOT_URL}/user/tag/post/card`, { tag: tag, cardName: name })
            .then(() => {
                dispatch(getTags())
            })
            .catch(() => {
            dispatch(authError('Failed to add tag'));
            });
        };
}