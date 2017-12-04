import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { addDeck } from '../actions';
import { connect } from 'react-redux';

class AddDeck extends Component {
    handleFormSubmit({ deckName }) {
        this.props.addDeck(deckName);
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
  
  AddDeck = connect(mapStateToProps, { addDeck })(AddDeck);
  
  export default reduxForm({
    form: 'addADeck',
    fields: ['deckName']
  })(AddDeck);