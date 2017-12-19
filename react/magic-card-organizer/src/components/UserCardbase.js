import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { getDecks, getCards, getTags, addToCards, addDeck, getDeckCards, getTagCards, getTagDecks } from '../actions';
import CardSearch from './CardSearch'
import AddDeck from './AddDeck'
import AddTag from './AddTag'
import AddCardToDeck from './AddCardToDeck'
import AddTagToDeck from './AddTagToDeck'
import DisplayDeckCards from './DiplayDeckCards'
import DisplayTagCards from './DisplayTagCards'
import DisplayTagDecks from './DisplayTagDecks'

import './basic.css';


class UserCardbase extends Component {

    renderAlert() {
        if (!this.props.error) return null;
        return <h3> { this.props.error } </h3>;
    }

    componentDidMount() {
        this.props.getDecks(); console.log(this.props.decks);
        this.props.getCards(); console.log(this.props.cards);
        this.props.getTags(); console.log(this.props.tags);
        console.log(this.props.getDeckCards)
    }
    render() { const getTheCardsOfDeck = this.props.getDeckCards
        return ( 
            <div className="whole">
                <div className="part">
                    <CardSearch />
                    <AddDeck/>
                    <AddTag/>
                </div>
                <div className="whole"> card from search
                    {Object.values(this.props.card).length && Object.values(this.props.card).map((value, i) => <div key={i} className="part">{value}</div>)}
                    {Object.values(this.props.card).length &&
                    <button onClick={() => {
                        this.props.addToCards(this.props.card.imageName)
                    }}>
                        Add to your cards
                    </button>}
                </div>
                <div> decks
                    {this.props.decks.length && this.props.decks.map((deck, i) => 
                        <div key={i}>
                            <li >{deck.name}</li>
                            <button onClick={() => {
                                console.log(getTheCardsOfDeck)
                                getTheCardsOfDeck(deck.name)
                            }}>
                                view cards
                            </button>
                        </div>
                     )}
                </div>
                <DisplayDeckCards/>
                <AddCardToDeck/>
                <AddTagToDeck/>
                <div> cards
                    {this.props.cards.length && this.props.cards.map((card, i) => <li key={i}>{card.name}</li>)}
                </div>
                <div> tags
                    {this.props.tags.length && this.props.tags.map((tag, i) => <div key={i}>
                        <li>{tag.tag}</li>
                        <button onClick={() => {
                                getTagCards(tag.tag)
                            }}>
                                view cards
                            </button>
                            <button onClick={() => {
                                getTagDecks(tag.tag)
                            }}>
                                view decks
                            </button>
                    </div>)}
                    <DisplayTagCards/>
                    <DisplayTagDecks/>
                </div>
            </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        decks: state.decks,
        tags: state.tags,
        cards: state.cards,
        card: state.card,
        deckCards: state.deckCards,
        tagCards: state.tagCards,
        error: state.auth.error,
    };
  };

export default connect(mapStateToProps, {  getDecks, getCards, getTags, addToCards, getDeckCards })(UserCardbase);
