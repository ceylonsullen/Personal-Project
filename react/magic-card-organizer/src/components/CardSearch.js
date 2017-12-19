import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { getCard } from '../actions';
import { connect } from 'react-redux';

class CardSearch extends Component {
    handleFormSubmit({ cardName }) {
        this.props.getCard(cardName);
        console.log(this.props.card)
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
                    <label>Card</label>
                    <Field name="cardName"
                    component="input"
                    type="text" />
                </fieldset>
                <button action ="submit">Search for A card </button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
      error: state.auth.error,
      card: state.card
    };
  };
  
  CardSearch = connect(mapStateToProps, { getCard })(CardSearch);
  
  export default reduxForm({
    form: 'cardSearch',
    fields: ['cardName']
  })(CardSearch);