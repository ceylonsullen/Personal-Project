import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { addCardToDeck } from '../actions';
import { connect } from 'react-redux';

class AddCardToDeck extends Component {
    handleFormSubmit({ deckName, cardName, place }) {
        this.props.addCardToDeck(deckName, cardName, place);
    }

    renderAlert() {
        if (!this.props.error) return null;
        return <h3> { this.props.error } </h3>;
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this))}>
                <fieldset>
                    <label>Deck Name</label>
                    <Field name="deckName"
                    component="input"
                    type="text" />
                </fieldset>
                <fieldset>
                    <label>Card Name</label>
                    <Field name="cardName"
                    component="input"
                    type="text" />
                </fieldset>
                <fieldset>
                    <label>choose mainboard, sideboard, or maybeboard </label>
                    <Field name="place"
                    component="input"
                    type="text" />
                </fieldset>
                <button action ="submit">Add a deck! </button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
      error: state.auth.error
    };
  };
  
  AddCardToDeck = connect(mapStateToProps, { addCardToDeck })(AddCardToDeck);
  
  export default reduxForm({
    form: 'addCardToDeck',
    fields: ['deckName', 'cardName', 'place']
  })(AddCardToDeck);