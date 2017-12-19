import { combineReducers } from 'redux';
import AuthReducer from './auth';
import DecksReducer from './decks';
import TagsReducer from './tags';
import CardsReducer from './cards';
import DeckCardsReducer from './deckCards';
import TagCardsReducer from './tagCards';
import TagDecksReducer from './tagDecks';
import AllCardsLookupReducer from './AllCardsLookup'
import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  form: FormReducer,
  decks: DecksReducer,
  tags: TagsReducer,
  cards: CardsReducer,
  card: AllCardsLookupReducer,
  deckCards: DeckCardsReducer,
  tagCards: TagCardsReducer,
  tagDecks: TagDecksReducer,
});

export default rootReducer;