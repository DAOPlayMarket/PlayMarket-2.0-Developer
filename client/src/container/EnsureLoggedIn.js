import React, { Component } from 'react'
import { connect } from 'react-redux'

import { setRedirectURL } from '../actions/auth'

class EnsureLoggedIn extends Component {
    componentDidMount() {
        const { isAuth, currentURL } = this.props;

        if (!isAuth) {
            this.props.setRedirectURL(currentURL);
            this.props.history.push('/auth');
        }
    }

    render() {
        const { isAuth, children } = this.props;
        if (isAuth) {
            return children
        } else {
            return null
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        isAuth: state.isAuth,
        currentURL: ownProps.location.pathname
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setRedirectURL: (url) => dispatch(setRedirectURL(url))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedIn)