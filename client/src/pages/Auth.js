import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Helmet} from "react-helmet";
import $ from "jquery";
import {utils as web3Utils} from 'web3';
import Popup from "reactjs-popup";

import lib from '../lib';

import Notification from '../components/Notification';

import { startLoading, endLoading } from '../actions/preloader'
import { userLogin } from '../actions/user'
import { setMode } from '../actions/mode'
import { setGasPrice } from '../actions/tx'
import { setContracts } from '../actions/contract'

import { getContractsInfo, getGasPrice, setProvider, getAddress_MM, getTxParams, sendTransaction_MM, getWallet, sendSignedTransaction, getTransactionStatus, contractMethod, getBalance, getData, getGasLimit, getSignedTransaction } from '../utils/web3'

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    async componentDidMount(){}

    getInitialState = () => {
        return {
            isRegistered: false,
            accountIsSelected: false,
            keystore: '',
            address: '',
            balance: '',
            popupOpen: false,
            user: {
                name: '',
                desc: ''
            },
            registration: {
                step: 1,
                password: '',
                hash: '',
                gasLimit: '',
                data: '',
                params: {
                    name: '',
                    desc: ''
                }
            }
        };
    };
    resetState = async () => {
        await this.setState(this.getInitialState());
    };

    recalculateGasPrice = async () => {
        let gasPrice = await getGasPrice();
        await this.props.setGasPrice({
            gasPrice: gasPrice
        })
    };

    getDeveloper = async () => {
        let { address } = this.state;
        let { contracts } = this.props;
        let info = await contractMethod({
            contract: contracts.PlayMarket,
            name: 'getInfoDev',
            params: [address]
        });
        return {
            name: web3Utils.hexToAscii(info.name).replace(/\u0000/g, ''),
            desc: web3Utils.hexToAscii(info.desc).replace(/\u0000/g, ''),
            state: info.state,
            store: info.store
        };
    };

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        document.getElementById("keystore").value = '';
        await this.resetState();
        await this.setState({ popupOpen: false });
    };

    setContractsInfo = async () => {
        let { contracts } = this.props;
        try {
            let contractsInfo = await getContractsInfo({
                Proxy: contracts.Proxy,
                ICO: contracts.ICO
            });
            let contractVersion = web3Utils.hexToAscii(contractsInfo.version).replace(/\u0000/g, '');
            this.props.setContracts({
                version: contractVersion,
                PlayMarket: contractsInfo.PlayMarket,
                ICO: contractsInfo.ICO,
                ICOList: contractsInfo.ICOList,
                endTime: contractsInfo.endTime,
                number: contractsInfo.number
            });
            if (contractVersion.split('.')[0] !== lib.version) {
                throw TypeError('You are using an incompatible version of "Play Market 2.0 Developer module". Last contract version (' + contractVersion + ') has a critical update! Please, download last actual version of "Play Market 2.0 Developer module" from GitHub.');
            }
        } catch (err) {
            throw err;
        }
    };

    handleChangeKeystore = async e => {
        e.persist();
        let { mode } = this.props;
        try {
            if (mode !== 'infura') {
                await setProvider('infura');
            }
            await this.setContractsInfo();
            await this.recalculateGasPrice();
            this.props.setMode({
                mode: 'keystore'
            });
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
                            accountIsSelected: true,
                            address: '0x' + json.address
                        });
                        try {
                            let developer = await this.getDeveloper();
                            let balance = await getBalance(this.state.address);
                            await this.setState({
                                isRegistered: developer.state,
                                balance: balance,
                                user: {
                                    ...this.state.user,
                                    name: developer.name,
                                    desc: developer.desc
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
        } catch (err) {
            Notification('error', err.message);
        }
    };
    handleClickMM = async e => {
        e.preventDefault();
        let { mode } = this.props;
        this.props.startLoading();
        try {
            if (mode !== 'metamask') {
                await setProvider('metamask');
            }
            await this.setContractsInfo();
            await this.recalculateGasPrice();
            this.props.setMode({
                mode: 'metamask'
            });
            let address = await getAddress_MM();
            if (address) {
                await this.setState({
                    accountIsSelected: true,
                    address: address
                });
                try {
                    let developer = await this.getDeveloper();
                    let balance = await getBalance(address);
                    await this.setState({
                        isRegistered: developer.state,
                        balance: balance,
                        user: {
                            ...this.state.user,
                            name: developer.name,
                            desc: developer.desc
                        }
                    });
                    await this.openModal();
                } catch(err) {
                    Notification('error', err.message);
                }
            } else {
                Notification('warning', 'Please, log in to your MetaMask account');
            }
        } catch (err) {
            Notification('error', err.message);
        }
        this.props.endLoading();
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

    handleSubmitLogin = async e => {
        e.preventDefault();
        let { mode } = this.props;
        let { isRegistered, address } = this.state;
        let { name, desc } = this.state.user;
        if (isRegistered) {
            switch (mode) {
                case 'keystore':
                    let { keystore } = this.state;
                    this.props.userLogin({
                        keystore: keystore,
                        address: address,
                        name: name,
                        desc: desc
                    });
                    break;
                case 'metamask':
                    this.props.userLogin({
                        address: address,
                        name: name,
                        desc: desc
                    });
                    break;
                default:
                    break;
            }
        }
    };

    handleSubmitRegistration_1 = async e => {
        e.preventDefault();
        let { address } = this.state;
        let { contracts } = this.props;
        let { name, desc } = this.state.registration.params;
        this.props.startLoading();
        try {
            let data = await getData({
                contract: contracts.PlayMarket,
                method: 'addDev',
                params: [web3Utils.toHex(name), web3Utils.toHex(desc)]
            });
            let gasLimit = await getGasLimit({
                contract: contracts.PlayMarket,
                from: address,
                data: data,
                reserve: 0
            });
            await this.setState({
                registration: {
                    ...this.state.registration,
                    step: 2,
                    data: data,
                    gasLimit: gasLimit
                }
            });
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
        let { mode, gasPrice, contracts } = this.props;
        let { data, gasLimit } = this.state.registration;
        this.props.startLoading();
        let tx;
        switch (mode) {
            case 'keystore':
                let { keystore } = this.state;
                let { password } = this.state.registration;
                try {
                    let wallet = await getWallet(keystore, password);
                    let signedTransaction = await getSignedTransaction({
                        wallet: wallet,
                        contract: contracts.PlayMarket,
                        data: data,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice
                    });
                    tx = await sendSignedTransaction(signedTransaction.rawTransaction);
                } catch (err) {
                    // Notification('error', err.message);
                    console.error(err.message);
                    Notification('error', 'Transaction failed');
                    return;
                }
                break;
            case 'metamask':
                let { address } = this.state;
                try {
                    let txParams = await getTxParams({
                        contract: contracts.PlayMarket,
                        data: data,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice,
                        from: address
                    });
                    tx = await sendTransaction_MM(txParams);
                } catch (err) {
                    // Notification('error', err.message);
                    console.error(err.message);
                    Notification('error', 'Transaction failed');
                    return;
                }
                break;
            default:
                Notification('error', 'Mode is not selected');
                break;
        }
        try {
            // let transactionStatus = await getTransactionStatus(tx.transactionHash);
            let balance = await getBalance(this.state.address);
            await this.setState({
                balance: balance,
                registration: {
                    ...this.state.registration,
                    hash: tx.transactionHash
                }
            });
            let developer = await this.getDeveloper();
            await this.setState({
                isRegistered: developer.state,
                user: {
                    ...this.state.user,
                    name: developer.name,
                    desc: developer.desc
                }
            });
            // if (transactionStatus) {
            //     let developer = await this.getDeveloper();
            //     await this.setState({
            //         isRegistered: developer.state,
            //         user: {
            //             ...this.state.user,
            //             name: developer.name,
            //             desc: developer.desc
            //         }
            //     });
            // } else {
            //     Notification('error', 'Transaction failed');
            // }
        } catch (err) {
            Notification('error', err.message);
        }
        this.props.endLoading();
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
        let { balance, popupOpen, accountIsSelected, isRegistered } = this.state;
        let { step, gasLimit, password } = this.state.registration;
        let { name, desc } = this.state.registration.params;

        let { gasPrice, mode } = this.props;

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
                    <div className="auth-entry__box">
                        <div className="auth-entry__keystore">
                            <input id="keystore" className="auth-entry__keystore--input" type="file" onChange={this.handleChangeKeystore}/>
                            <div className="auth-entry__keystore--text">Select keystore</div>
                        </div>
                        <div className="auth-entry__metamask">
                            <div className="auth-entry__metamask__divider">or</div>
                            <div className="auth-entry__metamask__btn">
                                <button onClick={this.handleClickMM}>MetaMask</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Popup className="auth-popup" open={popupOpen} onClose={this.closeModal}>
                    <div>
                        {
                            accountIsSelected ? (
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
                                                isRegistered ? 'login' : 'registration'
                                            }
                                        </div>
                                        {
                                            isRegistered ? (
                                                <form className="auth-popup__login" onSubmit={this.handleSubmitLogin}>
                                                    <div className="auth-popup__login__title">You already registered!</div>
                                                    <ul className="auth-popup__login__list">
                                                        <li className="auth-popup__login__list-item">
                                                            <div className="auth-popup__login__list-item__title">Name:</div>
                                                            <div className="auth-popup__login__list-item__value">{this.state.user.name}</div>
                                                        </li>
                                                        <li className="auth-popup__login__list-item">
                                                            <div className="auth-popup__login__list-item__title">Description:</div>
                                                            <div className="auth-popup__login__list-item__value">
                                                                {
                                                                    !!this.state.user.desc ? this.state.user.desc : (
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
                                                                        <div className="auth-popup__registration__list-item__title">Description:</div>
                                                                        <input className="auth-popup__registration__list-item__input" placeholder="Mobile & Web Apps Development Company" name="desc" type="text" value={desc} onChange={this.handleChangeDataParams}/>
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
                                                                        <div className="auth-popup__registration__preview-list__item--title">Description:</div>
                                                                        <div className="auth-popup__registration__preview-list__item--value">
                                                                            {
                                                                                !!desc ? desc : (
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
                                                                {
                                                                    mode === 'keystore' ? (
                                                                        <ul className="auth-popup__registration__list">
                                                                            <li className="auth-popup__registration__list-item">
                                                                                <div className="auth-popup__registration__list-item__title">Keystore password:</div>
                                                                                <input required className="auth-popup__registration__list-item__input" name="password" type="password" value={password} onChange={this.handleChangeTxParams}/>
                                                                            </li>
                                                                        </ul>
                                                                    ) : null
                                                                }
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
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gasPrice: state.gasPrice,
        mode: state.mode,
        contracts: state.contracts
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading()),
        userLogin: (payload) => dispatch(userLogin(payload)),
        setMode: (payload) => dispatch(setMode(payload)),
        setGasPrice: (payload) => dispatch(setGasPrice(payload)),
        setContracts: (payload) => dispatch(setContracts(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
