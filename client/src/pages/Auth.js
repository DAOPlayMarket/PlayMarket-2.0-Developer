import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Helmet} from "react-helmet";
import $ from "jquery";
import {utils as web3Utils}  from 'web3';
import Popup from "reactjs-popup";

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
            info: '',
            popupOpen: false
        };
    };
    resetState = async () => {
        await this.setState(this.getInitialState());
    };

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        document.getElementById("keystore").value = '';
        await this.resetState();
        await this.setState({ popupOpen: false });
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
                        this.openModal();
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
            };
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
                    <div className="auth-entry__btn" data-isselect={this.state.keystoreIsSelected}>
                        <input id="keystore" className="auth-entry__btn--input" type="file" onChange={this.handleChangeKeystore}/>
                        <div className="auth-entry__btn--text">{this.state.keystoreIsSelected ? 'Change keystore' : 'Select keystore'}</div>
                    </div>

                    <Popup className="auth-entry__popup" open={this.state.popupOpen} onClose={this.closeModal}>
                        <div>
                            {
                                this.state.keystoreIsSelected ? (
                                    <div>
                                        <div className="auth-entry__popup__main">
                                            <h3 className="auth-entry__popup__main__title">Account info</h3>
                                            <ul className="auth-entry__popup__main__list">
                                                <li className="auth-entry__popup__main__list-item">
                                                    <div className="auth-entry__popup__main__list-item__title">Address:</div>
                                                    <div className="auth-entry__popup__main__list-item__value">{this.state.address}</div>
                                                </li>
                                                <li className="auth-entry__popup__main__list-item">
                                                    <div className="auth-entry__popup__main__list-item__title">Balance:</div>
                                                    <div className="auth-entry__popup__main__list-item__value">{this.state.balanceETH} <span>ETH</span></div>
                                                </li>
                                            </ul>
                                        </div>
                                        {
                                            this.state.isRegistered && this.state.isConfirmed ? (
                                                <form className="auth-entry__popup__login" onSubmit={this.handleSubmitLogin}>
                                                    <div className="auth-entry__popup__login__title">You allready registered!</div>
                                                    <ul className="auth-entry__popup__login__list">
                                                        <li className="auth-entry__popup__login__list-item">
                                                            <div className="auth-entry__popup__login__list-item__title">Name:</div>
                                                            <div className="auth-entry__popup__login__list-item__value">{this.state.name}</div>
                                                        </li>
                                                    </ul>
                                                    <div className="auth-entry__popup__btn-block">
                                                        <button className="auth-entry__popup__btn-block__btn">login</button>
                                                        <div className="auth-entry__popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <form className="auth-entry__popup__registration" onSubmit={this.handleSubmitRegistration}>
                                                    <div className="auth-entry__popup__registration__title">You are not registered!</div>
                                                    <ul className="auth-entry__popup__registration__list">
                                                        <li className="auth-entry__popup__registration__list-item">
                                                            <div className="auth-entry__popup__registration__list-item__title">Keystore password:</div>
                                                            <input className="auth-entry__popup__registration__list-item__input" required type="password" value={this.state.password} onChange={this.handleChangePassword}/>
                                                        </li>
                                                        <li className="auth-entry__popup__registration__list-item">
                                                            <div className="auth-entry__popup__registration__list-item__title">Name:</div>
                                                            <input className="auth-entry__popup__registration__list-item__input" required type="text" value={this.state.name} onChange={this.handleChangeName}/>
                                                        </li>
                                                    </ul>
                                                    <div className="auth-entry__popup__btn-block">
                                                        <button className="auth-entry__popup__btn-block__btn">send tx</button>
                                                        <div className="auth-entry__popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                    </div>
                                                </form>
                                            )}
                                    </div>
                                ) : null
                            }
                        </div>
                    </Popup>
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
