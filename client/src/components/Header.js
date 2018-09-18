import React, { Component } from 'react'
import { connect } from 'react-redux'

import { authLogout } from '../actions/auth'

class Header extends Component {
    handleClick = () => {
        this.props.authLogout();
    };

    render(){
        let { address, name } = this.props;
        return (
          <header className="header">
            <div className="header__container">
              <div className="header__container--left">
                <div className="header__address">{address}</div>
              </div>
              <div className="header__container--right">
                <div className="header__name">{name}</div>
                <button className="header__logout" onClick={this.handleClick}>Logout</button>
              </div>
            </div>
          </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        address: state.user.address,
        name: state.user.name
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        authLogout: () => dispatch(authLogout()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
