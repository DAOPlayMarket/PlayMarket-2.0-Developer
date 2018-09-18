import React, { Component } from 'react'
import { connect } from 'react-redux'

class Preloader extends Component {
    render() {
        let { isLoading } = this.props;
        return (
            <div id="preloader" className={isLoading ? 'show' : 'hidden'}></div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.isLoading
    }
};

export default connect(mapStateToProps)(Preloader)