import React, { Component } from 'react'
import { connect } from 'react-redux'
import {utils as web3Utils}  from 'web3';

import { setGasPrice } from '../actions/tx'

import lib from '../lib'

class Control extends Component {
    handleChangeGasPrice = (e) => {
        let value = e.target.value;
        this.props.setGasPrice({
            gasPrice: web3Utils.toWei(value, 'gwei')
        })
    };

    render(){
        let { gasPrice, mode } = this.props;

        let value = web3Utils.fromWei(gasPrice, 'gwei');

        return (
            !!gasPrice && !!mode ? (
                <div className="control">
                    <div className="control__network">Network:&nbsp;
                        <span>
                            {
                                lib.ethereum.chainId === 1 ? 'Main' : null
                            }
                            {
                                lib.ethereum.chainId === 4 ? 'Rinkeby' : null
                            }
                        </span>
                    </div>
                    <div className="control__provider">Provider:&nbsp;
                        <span>
                            {
                                mode === 'keystore' ? 'Infura' : null
                            }
                            {
                                mode === 'metamask' ? 'MetaMask' : null
                            }
                        </span>
                    </div>
                    <div className="control__price">Gas Price: <span>{value}</span> Gwei</div>
                    <div className="control__input">
                        <input type="range" min="1" max="99" step="1" value={value} onChange={this.handleChangeGasPrice}/>
                    </div>
                    <div className="control__text">Gas Price is the amount you pay per unit of gas. TX fee = gas price * gas limit & is paid to miners for including your TX in a block. Higher the gas price = faster transaction, but more expensive. </div>
                    <div className="control__warning">Default value is recommended</div>
                </div>
            ) : null
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gasPrice: state.gasPrice,
        mode: state.mode
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setGasPrice: (payload) => dispatch(setGasPrice(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Control)
