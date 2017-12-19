import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';


class DisplayDeckCards extends Component {

    renderAlert() {
        if (!this.props.error) return null;
        return <h3> { this.props.error } </h3>;
    }

    componentDidMount() {
    }
    render() { const getTheCardsOfDeck = this.props.getDeckCards
        return ( 
            <div> 
                <div> main Board: 
                    {this.props.deckCards[0] &&this.props.deckCards[0].mainBoard.map((card, i) => <li key={i}>{card.name}</li>)
                     }
                </div>
                <div> Side Board: 
                    {this.props.deckCards[1] &&this.props.deckCards[1].sideBoard.map((card, i) => <li key={i}>{card.name}</li>)
                     }
                </div>
                <div> Maybe Board: 
                    {this.props.deckCards[2] &&this.props.deckCards[2].maybeBoard.map((card, i) => <li key={i}>{card.name}</li>)
                     }
            </div> 
            </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        deckCards: state.deckCards,
    };
  };

export default connect(mapStateToProps, {  })(DisplayDeckCards);
