import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
    getLinks() {
        if (this.props.authenticated) {
            return (
                <div>
                    <Link to="/signout">Sign Out</Link>
                </div>
            );
        }
        return [
            <div key = {1}>
                <Link to="/signin">Sign In</Link>
            </div>,
            <div key = {2}>
                <Link to="/signup">Sign Up</Link>
            </div>
        ];
    }
    render() {
        return (
            <div>
                <Link to="/">Home Page</Link>
                <div>{this.getLinks()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.auth.authenticated
    };
};
  
export default connect(mapStateToProps)(Header);