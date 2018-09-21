import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Helmet} from "react-helmet";
import $ from "jquery";
import {utils as web3Utils} from 'web3';
import Popup from "reactjs-popup";

import Notification from '../components/Notification';

import { startLoading, endLoading } from '../actions/preloader'
import { authLogin } from '../actions/auth'

import { getWallet, sendSignedTransaction, getTransactionStatus, contractMethod, getBalance, getData, getGasLimit, getSignedTransaction1 } from '../utils/web3'

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
            keystore: '',
            address: '',
            balance: '',
            popupOpen: false,
            user: {
                name: '',
                info: ''
            },
            registration: {
                step: 1,
                password: '',
                hash: '',
                gasLimit: '',
                data: '',
                params: {
                    name: '',
                    info: ''
                }
            }
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
                            balance: balance,
                            user: {
                                ...this.state.user,
                                name: developer.name,
                                info: developer.info
                            }
                        });
                        await this.openModal();
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
                    default:
                        Notification('An error occurred reading this file.');
                }
            }
        }
    };

    handleChangeTxParams = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({registration: {
            ...this.state.registration,
            [name]: e.target.value
        }});
    };

    handleChangeDataParams = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({registration: {
            ...this.state.registration, params: {
                ...this.state.registration.params, [name]: e.target.value
            }
        }});
    };

    getDeveloper = async () => {
        let { address } = this.state;
        let developer = await contractMethod({
            contract: 'dev',
            name: 'developers',
            params: [address]
        });
        return {
            isSet: developer.isSet,
            confirmation: developer.confirmation,
            name: web3Utils.hexToAscii(developer.name).replace(/\u0000/g, ''),
            info: web3Utils.hexToAscii(developer.info).replace(/\u0000/g, '')
        };
    };

    handleSubmitLogin = async e => {
        e.preventDefault();
        let { isRegistered, isConfirmed, keystore, address } = this.state;
        let { name, info } = this.state.user;
        if (isRegistered && isConfirmed) {
            this.props.authLogin({
                keystore: keystore,
                address: address,
                name: name,
                info: info
            });
        }
    };
    handleSubmitConfirmation = async e => {
        e.preventDefault();
        await this.closeModal();
    };

    handleSubmitRegistration_1 = async e => {
        e.preventDefault();
        let { address } = this.state;
        let { name, info } = this.state.registration.params;

        this.props.startLoading();
        try {
            let data = await getData({
                contract: 'main',
                method: 'registrationDeveloper',
                params: [web3Utils.toHex(name), web3Utils.toHex(info)]
            });
            let gasLimit = await getGasLimit({
                from: address,
                contract: 'main',
                data: data,
                reserve: 0
            });
            await this.setState({registration: {
                ...this.state.registration, step: 2, data: data, gasLimit: gasLimit
            }});
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };
    handleSubmitRegistration_2 = async e => {
        e.preventDefault();
        await this.setState({registration: {
            ...this.state.registration, step: 3
        }});
    };
    handleSubmitRegistration_3 = async e => {
        e.preventDefault();
        this.props.startLoading();
        let { keystore } = this.state;
        let { password, data, gasLimit } = this.state.registration;
        let { gasPrice } = this.props;
        try {
            let wallet = await getWallet(keystore, password);
            let signedTransaction = await getSignedTransaction1({
                wallet: wallet,
                contract: 'main',
                data: data,
                gasLimit: gasLimit,
                gasPrice: gasPrice
            });
            let tx = await sendSignedTransaction(signedTransaction.rawTransaction);
            let transactionStatus = await getTransactionStatus(tx.transactionHash);
            let balance = await getBalance(this.state.address);
            await this.setState({
                balance: balance,
                registration: {
                    ...this.state.registration,
                    hash: tx.transactionHash
                }
            });
            if (transactionStatus) {
                let developer = await this.getDeveloper();
                await this.setState({
                    isRegistered: developer.isSet,
                    isConfirmed: developer.confirmation,
                    user: {
                        ...this.state.user,
                        name: developer.name,
                        info: developer.info
                    }
                });
            } else {
                Notification('error', 'Transaction failed');
            }
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };

    handleBackRegistration_1 = async () => {
        await this.setState({registration: {
            ...this.state.registration, step: 1
        }});
    };
    handleBackRegistration_2 = async () => {
        await this.setState({registration: {
            ...this.state.registration,
            step: 2,
            password: ''
        }});
    };

    render() {
        let { balance, popupOpen, keystoreIsSelected, isRegistered, isConfirmed } = this.state;
        let { step, gasLimit, password } = this.state.registration;
        let { name, info } = this.state.registration.params;

        let { gasPrice } = this.props;

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
                    <div className="auth-entry__btn">
                        <input id="keystore" className="auth-entry__btn--input" type="file" onChange={this.handleChangeKeystore}/>
                        <div className="auth-entry__btn--text">Select keystore</div>
                    </div>
                    <Popup className="auth-popup" open={popupOpen} onClose={this.closeModal}>
                        <div>
                            {
                                keystoreIsSelected ? (
                                    <div>
                                        <div className="auth-popup__main">
                                            <h3 className="auth-popup__main__title">Account info</h3>
                                            <ul className="auth-popup__main__list">
                                                <li className="auth-popup__main__list-item">
                                                    <div className="auth-popup__main__list-item__title">Address:</div>
                                                    <div className="auth-popup__main__list-item__value">{this.state.address}</div>
                                                </li>
                                                <li className="auth-popup__main__list-item">
                                                    <div className="auth-popup__main__list-item__title">Balance:</div>
                                                    <div className="auth-popup__main__list-item__value">{web3Utils.fromWei(balance, 'ether')} <span>ETH</span></div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="auth-popup__action">
                                            <div className="auth-popup__action__title">
                                                {
                                                    isRegistered ? (
                                                        isConfirmed ? 'login' : 'confirmation'
                                                    ) : 'registration'
                                                }
                                            </div>
                                            {
                                                isRegistered ? (
                                                    <div>
                                                        {
                                                            isConfirmed ? (
                                                                <form className="auth-popup__login" onSubmit={this.handleSubmitLogin}>
                                                                    <div className="auth-popup__login__title">You already registered!</div>
                                                                    <ul className="auth-popup__login__list">
                                                                        <li className="auth-popup__login__list-item">
                                                                            <div className="auth-popup__login__list-item__title">Name:</div>
                                                                            <div className="auth-popup__login__list-item__value">{this.state.user.name}</div>
                                                                        </li>
                                                                        <li className="auth-popup__login__list-item">
                                                                            <div className="auth-popup__login__list-item__title">Info:</div>
                                                                            <div className="auth-popup__login__list-item__value">
                                                                                {
                                                                                    !!this.state.user.info ? this.state.user.info : (
                                                                                        <span className="auth-popup__login__list-item__value--placeholder">Not specified</span>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="auth-popup__btn-block">
                                                                        <button className="auth-popup__btn-block__btn">login</button>
                                                                        <div className="auth-popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                                    </div>
                                                                </form>
                                                            ) : (
                                                                <form className="auth-popup__login" onSubmit={this.handleSubmitConfirmation}>
                                                                    <div className="auth-popup__login__title">You registered, but you are not confirmed as the developer! After verification, you will be able to use the service! Please, try again later. Thank you for you waiting!</div>
                                                                    <ul className="auth-popup__login__list">
                                                                        <li className="auth-popup__login__list-item">
                                                                            <div className="auth-popup__login__list-item__title">Name:</div>
                                                                            <div className="auth-popup__login__list-item__value">{this.state.user.name}</div>
                                                                        </li>
                                                                        <li className="auth-popup__login__list-item">
                                                                            <div className="auth-popup__login__list-item__title">Info:</div>
                                                                            <div className="auth-popup__login__list-item__value">
                                                                                {
                                                                                    !!this.state.user.info ? this.state.user.info : (
                                                                                        <span className="auth-popup__login__list-item__value--placeholder">Not specified</span>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="auth-popup__btn-block auth-popup__btn-block--center">
                                                                        <button className="auth-popup__btn-block__btn">I understand</button>
                                                                    </div>
                                                                </form>
                                                            )
                                                        }
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {
                                                            step === 1 ? (
                                                                <form className="auth-popup__registration" onSubmit={this.handleSubmitRegistration_1}>
                                                                    <div className="auth-popup__registration__title">Please, fill in a form to continue.</div>
                                                                    <ul className="auth-popup__registration__list">
                                                                        <li className="auth-popup__registration__list-item">
                                                                            <div className="auth-popup__registration__list-item__title">Name:</div>
                                                                            <input className="auth-popup__registration__list-item__input" placeholder="Matellio" required name="name" type="text" value={name} onChange={this.handleChangeDataParams}/>
                                                                        </li>
                                                                        <li className="auth-popup__registration__list-item">
                                                                            <div className="auth-popup__registration__list-item__title">Info:</div>
                                                                            <input className="auth-popup__registration__list-item__input" placeholder="Mobile & Web Apps Development Company" name="info" type="text" value={info} onChange={this.handleChangeDataParams}/>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="auth-popup__btn-block">
                                                                        <button className="auth-popup__btn-block__btn">continue</button>
                                                                        <div className="auth-popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                                    </div>
                                                                </form>
                                                            ) : null
                                                        }
                                                        {
                                                            step === 2 ? (
                                                                <form className="auth-popup__registration" onSubmit={this.handleSubmitRegistration_2}>
                                                                    <div className="auth-popup__registration__title">Confirmation of the transaction data</div>
                                                                    <ul className="auth-popup__registration__preview-list">
                                                                        <li className="auth-popup__registration__preview-list__item">
                                                                            <div className="auth-popup__registration__preview-list__item--title">Name:</div>
                                                                            <div className="auth-popup__registration__preview-list__item--value">{name}</div>
                                                                        </li>
                                                                        <li className="auth-popup__registration__preview-list__item">
                                                                            <div className="auth-popup__registration__preview-list__item--title">Info:</div>
                                                                            <div className="auth-popup__registration__preview-list__item--value">
                                                                                {
                                                                                    !!info ? info : (
                                                                                        <span className="auth-popup__registration__preview-list__item--value__placeholder">Not specified</span>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <ul className="auth-popup__registration__list">
                                                                        <li className="auth-popup__registration__list-item">
                                                                            <div className="auth-popup__registration__list-item__title">Gas Limit:</div>
                                                                            <input className="auth-popup__registration__list-item__input" required name="gasLimit" type="number" value={gasLimit} onChange={this.handleChangeTxParams}/>
                                                                        </li>
                                                                    </ul>
                                                                    <ul className="auth-popup__registration__fee-list">
                                                                        <li className="auth-popup__registration__fee-list__item">
                                                                            <div className="auth-popup__registration__fee-list__item--title">Gas Price:</div>
                                                                            <div className="auth-popup__registration__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')} Gwei</div>
                                                                        </li>
                                                                        <li className="auth-popup__registration__fee-list__item">
                                                                            <div className="auth-popup__registration__fee-list__item--title">Approximate fee:</div>
                                                                            <div className="auth-popup__registration__fee-list__item--value">{web3Utils.fromWei((gasPrice * gasLimit).toString(), 'ether')}</div>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="auth-popup__btn-block">
                                                                        <button className="auth-popup__btn-block__btn">Accept</button>
                                                                        <div className="auth-popup__btn-block__btn--cancel" onClick={this.handleBackRegistration_1}>Back</div>
                                                                    </div>
                                                                </form>
                                                            ) : null
                                                        }
                                                        {
                                                            step === 3 ? (
                                                                <form className="auth-popup__registration" onSubmit={this.handleSubmitRegistration_3}>
                                                                    <div className="auth-popup__registration__title">Sending transaction</div>
                                                                    <ul className="auth-popup__registration__list">
                                                                        <li className="auth-popup__registration__list-item">
                                                                            <div className="auth-popup__registration__list-item__title">Keystore password:</div>
                                                                            <input className="auth-popup__registration__list-item__input" required name="password" type="password" value={password} onChange={this.handleChangeTxParams}/>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="auth-popup__btn-block">
                                                                        <button className="auth-popup__btn-block__btn">send tx</button>
                                                                        <div className="auth-popup__btn-block__btn--cancel" onClick={this.handleBackRegistration_2}>Back</div>
                                                                    </div>
                                                                </form>
                                                            ) : null
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
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
    return {
        gasPrice: state.gasPrice
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading()),
        authLogin: (payload) => dispatch(authLogin(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
