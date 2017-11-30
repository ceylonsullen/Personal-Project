const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./User.js');

const Card = require('./Card.js');
const Deck = require('./Deck.js');
const Tag = require('./Tag.js');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();

server.use(bodyParser.json());
server.use(session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: true
}));
server.use(cors(corsOptions));

const sendUserError = (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (err && err.message) {
      res.json({ message: err.message, stack: err.stack });
    } else {
      res.json({ error: err });
    }
  };


server.post('/users', (req, res) => {
    const { username, password } = req.body;
    if (!password || !username) {
        sendUserError('must provide a username and password', res);
        return;
    }
    bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
        if (err) {
            sendUserError(err, res);
            return;
        }
        const newUser = new User({ username, passwordHash: hash });
        newUser.save()
            .then((user) => {
                res.json({ success: true });
            })
            .catch((error) => {
                sendUserError(error, res);
            });
    });
});
server.post('/login', (req, res) => {
    const { username, password } = req.body;
        if (!username || !password) {
            sendUserError('please send both', res);
            return;
        }
    User.findOne({ username }).exec()
        .then((user) => {
            if (!user) sendUserError('bad credentials', res);
            else {
                bcrypt.compare(password, user.passwordHash, (err, result) => {
                if (err) sendUserError(err, res);
                else if (result) {
                    req.session.user = user.username;
                    res.json({ success: true });
                } else sendUserError('wrong password', res);
                });
            }
        })
        .catch((error) => {
            sendUserError(error, res);
        });
});
  
server.post('/logout', (req, res) => {
    req.session.destroy();
    return res.send({ success: "true" })
});

server.get('/card/:name', (req, res) => {
    const { name } = req.params;
    Card.findOne({$or: [ {imageName: name}, { name } ] })
        .exec()
        .then((card) => {
            return res.send(card)
        })
        .catch((err) => {
            return res.status(STATUS_USER_ERROR).send(err);
        })
});

server.use('/user', (req, res, next) => {
    if (req.session.user === null) sendUserError('not logged in!', res);
    if (req.session.user) {
        User.findOne({ username: req.session.user }).exec()
        .then((user) => {
          if (user) {
            req.user = user;
                next();
          } else sendUserError('not logged in!', res);
        })
        .catch((err) => {
          sendUserError(err, res);
        });
    } else sendUserError('not logged in!', res);
});
  
server.get('/user/decks', (req,res) => {
    const user = req.session.user;
    Deck.find({ user }).exec()
    .then((decksArray) => {
        return res.send(decksArray)
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
})

server.get('/user/tags', (req,res) => {
    const user = req.session.user;
    Tag.find({ user }).exec()
    .then((tagsArray) => {
        return res.send(tagsArray)
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
})

server.get('/user/cards', (req,res) => {
    const user = req.session.user;
    const userObject = req.user
    Card.find({_id : { $in: userObject.cards }}).exec()
    .then((cardsArray) => {
        console.log(user);
        return res.send(cardsArray)
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
})

server.use('/user/tag/get/:tag', (req, res, next) => {
    const { tag } = req.params;
    const user = req.user;
    Tag.findOne({ tag, user: user.username })
    .exec()
    .then((tagObject) => {
        if (!tagObject) return res.status(422).send({ error: 'no such tag found'})
        req.tag = tagObject;
        next();
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

server.use('/user/card/get/:name', (req, res, next) => {
    const { name } = req.params;
    const user = req.user;
    Card.findOne({ name, user: user.username })
    .exec()
    .then((cardObject) => {
        if (!cardObject) return res.status(422).send({ error: 'no such card found'})
        req.card = cardObject;
        next();
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

server.use('/user/deck/get/:name', (req, res, next) => {
    const { name } = req.params;
    const user  = req.user;
    Deck.findOne({ name, user: user.username })
    .exec()
    .then((deckObject) => {
        if (!deckObject) return res.status(422).send({ error: 'no such deck found'})
        req.deck = deckObject;
        next();
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

server.get('/user/deck/get/:name/cards', (req, res) => {
    const deck = req.deck;
    const board = [];
    Card.find({ _id : { $in: deck.mainBoard } })
    .exec()
    .then((mainCards) => {
        board.push({ mainBoard: mainCards })
        Card.find({ _id : { $in: deck.sideBoard } })
        .exec()
        .then((sideCards) => {
            board.push({ sideBoard: sideCards })
            Card.find({ _id : { $in: deck.maybeBoard } })
            .exec()
            .then((maybeCards) => {
                board.push({ maybeBoard: maybeCards })
            })
            .then(() => {
                return res.send(board);
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            })
        })
        .catch((err) => {
            return res.status(STATUS_USER_ERROR).send(err);
        })
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
});

server.get('/user/deck/get/:name/tags', (req, res) => {
    const deck = req.deck;
    Tag.find({_id : { $in: deck.tags } }).select({tag: 1})
    .exec()
    .then((tags) => {
         return res.send(tags);
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});


server.get('/user/tag/:tag/cards', (req, res) => {
    const tag = req.tag;
    Card.find({_id : { $in: tag.cards } })
    .exec()
    .then((cards) => {
        res.send(cards);
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

server.get('/user/tag/:tag/decks', (req, res) => {
    const tag = req.tag;
    Deck.find({_id : { $in: tag.decks } })
    .exec()
    .then((decks) => {
        res.send(decks);
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

// posters and post middleware for decks
server.use('/user/deck/post', (req, res, next) => {
    const { name } = req.body;
    const user = req.user;
    Deck.findOne({ name, _id : { $in: user.decks }  }).exec()
    .then(foundDeck => {
        if (foundDeck) req.deck = foundDeck;
        else req.deck = null;
        next();
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
})

//add a deck if it doesn't exist yet
server.post('/user/deck/post/add', (req, res) => {
    const { name } = req.body;
    const user = req.session.user;
    const userObject = req.user;
    if (req.deck) {
        return res.status(STATUS_USER_ERROR).send({error: "you already have a deck by that name!"})
    } else {
        const deckToCreate = new Deck({ name, user })
        deckToCreate.save()
        .then((createdDeck) => {
            console.log(createdDeck);
            userObject.decks.push(createdDeck)
            userObject.save()
            .then(() => {
                return res.send({ success: "true" });
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            });
        })
        .catch((err) => {
            return res.status(STATUS_USER_ERROR).send(err);
        })
    }
})

// posters and middle ware for posts for card
server.use('/user/card/post', (req, res, next) => {
    const { name } = req.body;
    const user = req.user;
    Card.findOne({ name, _id : { $in: user.cards }  }).exec()
    .then(foundCard => {
        if (foundCard) req.card = foundCard;
        else req.card = null;
        next();
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
})

//add a card if it doesn't exist yet
server.post('/user/card/post/add', (req, res) => {
    const { name } = req.body;
    const user = req.session.user;
    const userObject = req.user;
    if (req.card) {
        return res.status(STATUS_USER_ERROR).send({error: "you already have a card by that name!"})
    } else {
        Card.findOne({name})
        .then((createdCard) => {
            console.log(createdCard);
            userObject.cards.push(createdCard)
            userObject.save()
            .then(() => {
                return res.send({ success: "true" });
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            });
        })
        .catch((err) => {
            return res.status(STATUS_USER_ERROR).send(err);
        })
    }
})

// posters and post middlewares for tags
server.use('/user/tag/post', (req, res, next) => {
    const { tag } = req.body;
    console.log(req.user)
    const user = req.user;
    Tag.findOne({ tag, _id : { $in: user.tags }  }).exec()
    .then(foundTag => {
        if (foundTag) req.tag = foundTag;
        else req.tag = null;
        next();
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    })
})
//add tag if it doesn't exist yet
server.post('/user/tag/post/add', (req, res) => {
    const { tag } = req.body;
    const user = req.session.user;
    const userObject = req.user;
    if (req.tag) {
        return res.status(STATUS_USER_ERROR).send({error: "you already have a tag by that name!"})
    } else {
        const TagToCreate = new Tag({ tag, user })
        TagToCreate.save()
        .then((createdTag) => {
            console.log(createdTag);
            userObject.tags.push(createdTag)
            userObject.save()
            .then(() => {
                return res.send({ success: "true" });
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            });
        })
        .catch((err) => {
            return res.status(STATUS_USER_ERROR).send(err);
        })
    }
})

// add tag to deck
server.put('/user/deck/post/tag', (req, res) => {
    const deck = req.deck;
    if (!deck) return res.status(STATUS_USER_ERROR).send({error: "no deck by that name!"})
    const { tag } = req.body;
    if (!tag) return res.status(STATUS_USER_ERROR).send({error: "must include tag in the body!"})
    const user = req.user;
    Tag.findOne({ tag, user: user.username}).exec()
    .then(tagForDeck => {
        if (tagForDeck) {
            if (deck.tags.indexOf(tagForDeck._id) < 0) { // if that tag isn't already part of the deck
                deck.tags.push(tagForDeck);
                deck.save()
                .then(() => {
                    tagForDeck.decks.push(deck)
                    tagForDeck.save()
                    .catch((err) => {
                        return res.status(STATUS_USER_ERROR).send(err);
                    })
                })
                .catch((err) => {
                    return res.status(STATUS_USER_ERROR).send(err);
                }) 
            } else {
                return res.status(STATUS_USER_ERROR).send({ Error: "that deck already has that tag!"})
            }
        } else {
            const myNewTagForDeck = new Tag({tag, user: user.username})
            myNewTagForDeck.save()
            .then(() => {
                Tag.findOne({ tag, user: user.username}).exec()
                .then((newlyMadeTag) => {
                    user.tags.push(newlyMadeTag)
                    user.save()
                    .then(() => {
                        deck.tags.push(newlyMadeTag);
                        deck.save()
                        .then(() => {
                            newlyMadeTag.decks.push(deck)
                            newlyMadeTag.save()
                            .catch((err) => {
                                return res.status(STATUS_USER_ERROR).send(err);
                            })
                        })
                        .catch((err) => {
                            return res.status(STATUS_USER_ERROR).send(err);
                        })
                    })
                    .catch((err) => {
                        return res.status(STATUS_USER_ERROR).send(err);
                    })
                })
                .catch((err) => {
                    return res.status(STATUS_USER_ERROR).send(err);
                }) 
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            }) 
        }
    })
    .then(() => {
        return res.send({ success: "true" })
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

// now we have to add cards to decks, to any of the boards
server.put('/user/deck/post/card', (req, res) => {
    const deck = req.deck;
    if (!deck) return res.status(STATUS_USER_ERROR).send({error: "no deck by that name!"})
    const { cardName } = req.body;
    if (!cardName|| !req.body.place || !(req.body.place === 'mainBoard' ||            req.body.place === 'sideBoard' || req.body.place === 'maybeBoard') ) {
        return res.status(STATUS_USER_ERROR).send({error: "must include cardName and board place in the body!"})
    }
    const user = req.user;
    const { place } = req.body
    Card.findOne({ imageName: cardName }).exec()
    .then(cardForDeck => {
        if (cardForDeck) {
            if (user.cards.indexOf(cardForDeck._id) < 0) {
                user.cards.push(cardForDeck)
                user.save()
                .catch((err) => {
                    return res.status(STATUS_USER_ERROR).send(err);
                })
            }
            deck[place].push(cardForDeck);
            deck.save()
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            })
        } else {
            return res.status(STATUS_USER_ERROR).send({ error: "that card does not exist"});            
        }
    })
    .then(() => {
        return res.send({ success: "true" })
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

// add a card to a tag, card name must be to lower case
server.put('/user/tag/post/card', (req, res) => {
    const tag = req.tag;
    if (!tag) return res.status(STATUS_USER_ERROR).send({error: "no tag by that name!"})
    const { cardName } = req.body;
    if (!cardName ) {
        return res.status(STATUS_USER_ERROR).send({error: "must include cardName in the body!"})
    }
    const user = req.user;
    Card.findOne({ imageName: cardName }).exec()
    .then(cardForDeck => {
        if (cardForDeck) {
            tag.cards.push(cardForDeck);
            tag.save()
            .then(() => {
                if (user.cards.indexOf(cardForDeck._id) < 0) {
                    user.cards.push(cardForDeck)
                    user.save()
                    .catch((err) => {
                        return res.status(STATUS_USER_ERROR).send(err);
                    })
                }
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            })
        } else {
            return res.status(STATUS_USER_ERROR).send({ error: "that card does not exist"});            
        }
    })
    .then(() => {
        return res.send({ success: "true" })
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});

// add a deck to a tag

server.put('/user/tag/post/deck', (req, res) => {
    const tag = req.tag;
    if (!tag) return res.status(STATUS_USER_ERROR).send({error: "no tag by that name!"})
    const { deck } = req.body;
    if (!deck) return res.status(STATUS_USER_ERROR).send({error: "must include deck in the body!"})
    const user = req.user;
    Deck.findOne({ name: deck, user: user.username}).exec()
    .then(deckForTag => {
        if (deckForTag) {
            if (tag.decks.indexOf(deckForTag._id) < 0) { // if that deck isn't already part of the tag
                tag.decks.push(deckForTag);
                tag.save()
                .then(() => {
                    deckForTag.tags.push(tag)
                    deckForTag.save()
                    .catch((err) => {
                        return res.status(STATUS_USER_ERROR).send(err);
                    })
                })
                .catch((err) => {
                    return res.status(STATUS_USER_ERROR).send(err);
                }) 
            } else {
                return res.status(STATUS_USER_ERROR).send({ Error: "that deck already has that deck!"})
            }
        } else {
            const myNewDeckForTag = new Deck({ name:deck, user: user.username})
            myNewDeckForTag.save()
            .then(() => {
                Deck.findOne({ name: deck, user: user.username}).exec()
                .then((newlyMadeDeck) => {
                    user.decks.push(newlyMadeDeck)
                    user.save()
                    .then(() => {
                        tag.decks.push(newlyMadeDeck);
                        tag.save()
                        .then(() => {
                            newlyMadeDeck.tags.push(deck)
                            newlyMadeDeck.save()
                            .catch((err) => {
                                return res.status(STATUS_USER_ERROR).send(err);
                            })
                        })
                        .catch((err) => {
                            return res.status(STATUS_USER_ERROR).send(err);
                        })
                    })
                    .catch((err) => {
                        return res.status(STATUS_USER_ERROR).send(err);
                    })
                })
                .catch((err) => {
                    return res.status(STATUS_USER_ERROR).send(err);
                }) 
            })
            .catch((err) => {
                return res.status(STATUS_USER_ERROR).send(err);
            }) 
        }
    })
    .then(() => {
        return res.send({ success: "true" })
    })
    .catch((err) => {
        return res.status(STATUS_USER_ERROR).send(err);
    }) 
});


// server.put('/user/card/tag', (req, res) => {
//     const { name } = req.body;
//     const { addTag } = req.body;
//     const { user } = req.body;
//     Card.findOne({$or: [ {imageName: name}, { name } ] })
//         .exec()
//         .then((card) => {
        
//                 Tag.findOne({tag: addTag, user: user}).exec()
//                 .then(tagObject => {
            
//                     if (tagObject) {
//                         await (() => {
//                             if (tagObject.cards.indexOf(card._id) < 0) {
//                                 tagObject.cards.push(card)
//                                 tagObject.save()
//                                 .catch(err => {
//                                     return res.status(422).send(err)
//                                 })
//                             }
//                         })();
//                         await (() => {
//                             User.findOne({ username: user }).exec()
//                             .then(currentUser => {
//                                 if (currentUser.cards.indexOf(card._id) < 0) {
//                                     currentUser.cards.push(card)
//                                     currentUser.save()
//                                     .catch(err => {
//                                         return res.status(422).send(err)
//                                     })
//                                 }
//                             })
//                         })();
//                     } else {
//                         const newTagObject = new Tag({tag: addTag, user: user})
//                         newTagObject.save()
//                         .then(() => {
//                             Tag.findOne({tag: addTag, user: user}).exec()
//                             .then(thisTagObject => {
//                                 thisTagObject.cards.push(card)
//                                 thisTagObject.save()
//                                 .catch(err => {
//                                     return res.status(422).send(err)
//                                 })
//                                 User.findOne({ username: user }).exec()
//                                 .then(currentUser => {
//                                     if (currentUser.cards.indexOf(card._id) < 0) {
//                                         currentUser.cards.push(card)
//                                         currentUser.save()
//                                         .catch(err => {
//                                             return res.status(422).send(err)
//                                         })
//                                     }
//                                 })
//                             })
//                             .catch(err => {
//                                 return res.status(422).send(err)
//                             })
//                         })
//                         .catch(err => {
//                             return res.status(422).send(err)
//                         })
                        
//                     }
                    
//                 })
//                 .catch(err => {
//                     return res.status(422).send(err)
//                 })
//         })
//         .then(() => {
//             return res.send({success: true});
//         })
//         .catch((err) => {
//             return res.status(STATUS_USER_ERROR).send(err);
//         })
// })

// server.put('user/deck/get/:name', (req, res) => {
//     const { name } = req.params;
//     const { cardName, place } = req.body;
//     const { user } = req.body;
//     if (!(place === "mainBoard" || place === "sideBoard" || place === "maybeBoard")) {
//       return res.status(422).send({error: "must assign card to either the mainBoard, sideBoard, or maybeBoard"})
//     }
//     Card.findOne({$or: [ {imageName: cardName}, { name: cardName } ] })
//         .exec()
//         .then((card) => {
    
//             Deck.findOne({name, user: user }).exec()
//             .then((deck) => {
//                 if (deck) {
//                     place === "mainBoard" ? deck.mainBoard.push(card) : place === "sideBoard" ? deck.sideBoard.push(card) : place === "maybeBoard" ? deck.maybeBoard.push(card) : null
//                     deck.save()
//                     .catch((err) => {
//                         return res.status(STATUS_USER_ERROR).send(err);
//                     })
//                 } else {
//                     const newlyCreatedDeck = new Deck({name, user: user})
            
//                     newlyCreatedDeck.save()
//                     .then(() => {
//                         Deck.findOne({name, user: user}).exec()
//                         .then(foundDeck => {
                    
//                             place === "mainBoard" ? foundDeck.mainBoard.push(card) : place === "sideBoard" ? foundDeck.sideBoard.push(card) : place === "maybeBoard" ? foundDeck.maybeBoard.push(card) : null
//                             foundDeck.save()
//                             .catch((err) => {
//                                 return res.status(STATUS_USER_ERROR).send(err);
//                             })
//                         })
//                         .catch((err) => {
//                             return res.status(STATUS_USER_ERROR).send(err);
//                         })
//                     })
//                     .catch((err) => {
//                         return res.status(STATUS_USER_ERROR).send(err);
//                     })
//                 }
//             })
//             .catch((err) => {
//                 return res.status(STATUS_USER_ERROR).send(err);
//             })
//         })
//         .then(() => {
//             return res.send({success: true});
//         })
//         .catch((err) => {
//             return res.status(STATUS_USER_ERROR).send(err);
//         })
// })




module.exports = { server };
