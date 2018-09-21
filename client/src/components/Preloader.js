import React, { Component } from 'react'
import { connect } from 'react-redux'

class Preloader extends Component {
    render() {
        let { isLoading } = this.props;
        return (
            <div className={'preloader ' + (isLoading ? 'show' : 'hidden')}>
                <div className="preloader-box">
                    <div className="preloader-box__text">Processing... Please, wait.</div>
                    <div className="preloader-box__image"></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.isLoading
    }
};

export default connect(mapStateToProps)(Preloader)