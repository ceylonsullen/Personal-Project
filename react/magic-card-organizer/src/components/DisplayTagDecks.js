import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';


class DisplayTagDecks extends Component {

    renderAlert() {
        if (!this.props.error) return null;
        return <h3> { this.props.error } </h3>;
    }

    componentDidMount() {
    }
    render() {
        return ( 
            <div> 
                <div> Tag Decks: 
                    {console.log('ayyyy', this.props.tagDecks)}{this.props.tagDecks.length &&this.props.tagDecks.map((deck, i) => <li key={i}>{deck.name}</li>)
                     }
                </div>
            </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        tagDecks: state.tagDecks,
    };
  };

export default connect(mapStateToProps, {  })(DisplayTagDecks);
