import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';


class DisplayTagCards extends Component {

    renderAlert() {
        if (!this.props.error) return null;
        return <h3> { this.props.error } </h3>;
    }

    componentDidMount() {
    }
    render() { const getTheTagCards = this.props.getTagCards
        return ( 
            <div> 
                <div> Tag Cards: 
                    {this.props.tagCards.length &&this.props.tagCards.map((card, i) => <li key={i}>{card.name}</li>)
                     }
                </div>
            </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        tagCards: state.tagCards,
    };
  };

export default connect(mapStateToProps, {  })(DisplayTagCards);
