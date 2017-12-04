import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { addTagToDeck, getTags } from '../actions';
import { connect } from 'react-redux';

class AddTagToDeck extends Component {
    handleFormSubmit({ deckName, tag  }) {
        this.props.addTagToDeck(deckName, tag );
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
                    <label>tag Name</label>
                    <Field name="tag"
                    component="input"
                    type="text" />
                </fieldset>
                <button action ="submit">Add tag to deck! </button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
      error: state.auth.error
    };
  };
  
  AddTagToDeck = connect(mapStateToProps, { addTagToDeck, getTags })(AddTagToDeck);
  
  export default reduxForm({
    form: 'addTagToDeck',
    fields: ['tag']
  })(AddTagToDeck);