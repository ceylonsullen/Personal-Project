import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { addTag } from '../actions';
import { connect } from 'react-redux';

class AddTag extends Component {
    handleFormSubmit({ tagName }) {
        this.props.addTag(tagName);
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
                    <label>Tag Name</label>
                    <Field name="tagName"
                    component="input"
                    type="text" />
                </fieldset>
                <button action ="submit">Add a tag! </button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
      error: state.auth.error
    };
  };
  
  AddTag = connect(mapStateToProps, { addTag })(AddTag);
  
  export default reduxForm({
    form: 'addAtag',
    fields: ['tagName']
  })(AddTag);