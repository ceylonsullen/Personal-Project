import React, { Component } from 'react';
import { connect } from 'react-redux';


export default ComposedComponent => {
  class RequireAuthentication extends Component {
    componentWillMount() {
      if (!this.props.authenticated) this.props.history.push('/signin');
    }

    render() { console.log();
      return (<div> {this.props.authenticated ? <ComposedComponent/> : null }  </div>);
    }
  }

  const mapStateToProps = state => {
    return {
      authenticated: state.auth.authenticated
    };
  };

  return connect(mapStateToProps)(RequireAuthentication);
};
