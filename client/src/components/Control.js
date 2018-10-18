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
        let { gasPrice, mode, contracts, nodes, node} = this.props;

        let value = web3Utils.fromWei(gasPrice, 'gwei');

        return (
            <div className="control">
                <div className="control__logo"></div>
                <div className="control__web3">
                    <div className="control__web3-title">Blockchain</div>
                    {
                        !!gasPrice && !!mode ? (
                            <ul className="control__web3__list">
                                <li className="control__web3__list-item control__web3__list-item__typical">Network:&nbsp;
                                    <span>
                                        {
                                            lib.ethereum.chainId === 1 ? 'Main' : null
                                        }
                                        {
                                            lib.ethereum.chainId === 4 ? 'Rinkeby' : null
                                        }
                                    </span>
                                </li>
                                <li className="control__web3__list-item control__web3__list-item__typical">Provider:&nbsp;
                                    <span>
                                        {
                                            mode === 'keystore' ? 'Infura' : null
                                        }
                                        {
                                            mode === 'metamask' ? 'MetaMask' : null
                                        }
                                    </span>
                                </li>
                                <li className="control__web3__list-item control__web3__list-item__typical">Contracts version:&nbsp;<span>{contracts.version}</span></li>

                                <li className="control__web3__list-item control__web3__list-item__price">Gas Price: <span>{value}</span> Gwei</li>
                                <li className="control__web3__list-item control__web3__list-item__input"><input type="range" min="1" max="99" step="1" value={value} onChange={this.handleChangeGasPrice}/></li>
                                <li className="control__web3__list-item control__web3__list-item__text">Gas Price is the amount you pay per unit of gas. TX fee = gas
                                    price * gas limit & is paid to miners for including your TX in a block. Higher the gas
                                    price = faster transaction, but more expensive.</li>
                                <li className="control__web3__list-item control__web3__list-item__warning">Default value is recommended</li>
                            </ul>
                        ) : (
                            <div className="control__web3__placeholder">
                                Now you are not connected to Ethereum
                            </div>
                        )
                    }
                </div>
                <div className="control__nodes">
                    <div className="control__nodes-title">Node</div>
                    {
                        !!node.domain ? (
                            <div className="control__nodes__list">
                                <div className="control__nodes__list-item">Domain: <span>{node.domain}</span></div>
                                <div className="control__nodes__list-item">IP: <span>{node.ip}</span></div>
                                <div className="control__nodes__list-item">Lat: <span>{node.lat}</span></div>
                                <div className="control__nodes__list-item">Long: <span>{node.long}</span></div>
                            </div>
                        ) : (
                            <div className="control__nodes__placeholder">Connection with node is not established</div>
                        )
                    }
                    {/*<div className="control__nodes-title">Nodes list</div>*/}
                    {/*<ul className="control__nodes-list">*/}
                        {/*{*/}
                            {/*nodes.map((node, index) => {*/}
                                {/*return (*/}
                                    {/*<div className="control__nodes-list__item" key={index}>{node.domain}</div>*/}
                                {/*)*/}
                            {/*})*/}
                        {/*}*/}
                    {/*</ul>*/}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gasPrice: state.gasPrice,
        mode: state.mode,
        contracts: state.contracts,
        nodes: state.nodes,
        node: state.node
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setGasPrice: (payload) => dispatch(setGasPrice(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Control)
