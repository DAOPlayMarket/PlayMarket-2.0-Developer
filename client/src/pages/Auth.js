import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Helmet} from "react-helmet";
import $ from "jquery";
import {utils as web3Utils}  from 'web3';

import Notification from '../components/Notification';

import { startLoading, endLoading } from '../actions/preloader'
import { authLogin } from '../actions/auth'

import { getWallet, getSignedTransaction, sendSignedTransaction, getTransactionStatus, contractMethod, getBalance } from '../utils/web3'

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState = () => {
        return {
            isRegistered: false,
            isConfirmed: false,
            keystoreIsSelected: false,
            hashTx: '',
            keystore: '',
            address: '',
            balanceWEI: '',
            balanceETH: '',
            password: '',
            name: '',
            info: ''
        };
    };
    resetState = async () => {
        await this.setState(this.getInitialState());
    };

    handleChangeKeystore = async e => {
        e.persist();
        await this.resetState();
        let file = e.target.files[0];
        if (file) {
            this.props.startLoading();
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = async (event) => {
                let content = event.target.result;
                try {
                    let json = JSON.parse(content);
                    await this.setState({
                        keystore: JSON.stringify(json),
                        keystoreIsSelected: true,
                        address: '0x' + json.address
                    });
                    try {
                        let developer = await this.getDeveloper();
                        let balance = await getBalance(this.state.address);
                        await this.setState({
                            isRegistered: developer.isSet,
                            isConfirmed: developer.confirmation,
                            name: developer.name,
                            info: developer.info,
                            balanceWEI: balance,
                            balanceETH: web3Utils.fromWei(balance, 'ether')
                        });
                        this.props.endLoading();
                    } catch(err) {
                        this.props.endLoading();
                        Notification('error', err.message);
                    }
                } catch (err) {
                    this.props.endLoading();
                    $(e.target).val('');
                    Notification('error', 'This is not a valid wallet file.');
                }
            }
            reader.onerror = (e) => {
                switch(e.target.error.code) {
                    case e.target.error.NOT_FOUND_ERR:
                        Notification('error', 'File Not Found!');
                        break;
                    case e.target.error.NOT_READABLE_ERR:
                        Notification('error', 'File is not readable');
                        break;
                    case e.target.error.ABORT_ERR:
                        break;
                    default:
                        Notification('An error occurred reading this file.');
                }
            }
        }
    };

    handleChangePassword = async e => {
        await this.setState({password: e.target.value});
    };
    handleChangeName= async e => {
        await this.setState({name: e.target.value});
    };
    handleChangeInfo = async e => {
        await this.setState({info: e.target.value});
    };

    getDeveloper = async () => {
        let developer = await contractMethod({
            contract: 'dev',
            name: 'developers',
            params: [this.state.address]
        });
        return {
            isSet: developer.isSet,
            confirmation: developer.confirmation,
            name: web3Utils.hexToAscii(developer.name).replace(/\u0000/g, ''),
            info: web3Utils.hexToAscii(developer.info).replace(/\u0000/g, '')
        };
    };

    handleSubmitRegistration = async e => {
        e.preventDefault();
        let { keystore, password, name, info } = this.state;
        this.props.startLoading();
        try {
            let wallet = await getWallet(keystore, password);
            let signedTransaction = await getSignedTransaction({
                wallet: wallet,
                contract: 'main',
                data: {
                    method: 'registrationDeveloper',
                    params: [web3Utils.toHex(name), web3Utils.toHex(info)]
                }
            });
            let tx = await sendSignedTransaction(signedTransaction.rawTransaction);
            let transactionStatus = await getTransactionStatus(tx.transactionHash);
            let balance = await getBalance(this.state.address);
            await this.setState({
                hashTx: tx.transactionHash,
                balanceWEI: balance,
                balanceETH: web3Utils.fromWei(balance, 'ether')
            });
            if (transactionStatus) {
                try {
                    let developer = await this.getDeveloper();
                    await this.setState({
                        isRegistered: developer.isSet,
                        isConfirmed: developer.confirmation,
                        name: developer.name,
                        info: developer.info
                    });
                    this.props.endLoading();
                } catch(err) {
                    this.props.endLoading();
                    Notification('error', err.message);
                }
            } else {
                this.props.endLoading();
                Notification('error', 'Transaction failed');
            }
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };

    handleSubmitLogin = async e => {
        e.preventDefault();
        let { isRegistered, isConfirmed, keystore, address, name, info } = this.state;
        if (isRegistered && isConfirmed) {
            this.props.authLogin({
                keystore: keystore,
                address: address,
                name: name,
                info: info
            });
        }
    };

    render() {
        return (
            <div className="auth">
                <Helmet>
                    <title>Auth | Play Market 2.0 Developer Module</title>
                </Helmet>
                <div className="auth-banner">
                    <div className="auth-banner__container">
                        <div className="auth-banner__title">Login to your decentralized developer account</div>
                        <div className="auth-banner__text-1">Do you want to croudfund your app via build-in ICO
                            platform? Or sell your app for cryptocurrency? Want to see through transparent payment
                            transactions via blockchain?
                        </div>
                        <div className="auth-banner__text-2">Distribute your apps on Play Market 2.0 store and increase
                            your downloads and monetisation.
                        </div>
                        <div className="auth-banner__btn-block">
                            <div className="auth-banner__btn-block__btn">Distribute your apps on Playmarket 2.0</div>
                        </div>
                        <div className="auth-banner__text-3">Its free!</div>
                    </div>
                </div>
                <div className="auth-entry">
                    <input type="file" onChange={this.handleChangeKeystore}/>
                    {
                        this.state.keystoreIsSelected ? (
                            <div>
                                <br/>
                                <div>Address: {this.state.address}</div>
                                <div>Balance: {this.state.balanceETH} ETH</div>
                                <div>Registered: {this.state.isRegistered ? 'YES' : 'NO'}</div>
                                <br/>
                                <br/>
                            </div>
                        ) : null
                    }
                    {
                        this.state.keystoreIsSelected ?
                        (
                            this.state.isRegistered && this.state.isConfirmed ?
                            (
                                <form onSubmit={this.handleSubmitLogin}>
                                    <button>LOGIN</button>
                                </form>
                            ) : (
                                <form onSubmit={this.handleSubmitRegistration}>
                                    <title>Registration</title>
                                    <input type="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}/>
                                    <br/>
                                    <input type="text" placeholder="Name" value={this.state.name} onChange={this.handleChangeName}/>
                                    <br/>
                                    <input type="text" placeholder="Info" value={this.state.info} onChange={this.handleChangeInfo}/>
                                    <br/>
                                    <button>REGISTRATION</button>
                                </form>
                            )
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading()),
        authLogin: (payload) => dispatch(authLogin(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
