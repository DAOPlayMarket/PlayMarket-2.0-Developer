import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";
import {utils as web3Utils} from 'web3';
import Popup from "reactjs-popup";

import { startLoading, endLoading } from '../actions/preloader'

import Notification from '../components/Notification';

import { sendTransaction_MM, getTxParams, getWallet, sendSignedTransaction, getBalance, getGasLimit, getData, getDataByTypes, getSignedTransaction } from '../utils/web3';

class Apps extends Component {
    state = {
        data: {
            app: null,
            price: '',
            publish: null
        },
        popupOpen: false,
        popup: {},
        balance: '',
        apps: [],
        loadedApps: [],
        // notLoadedApps: []
    };

    async componentDidMount(){
        await this.getApps();
        await this.resetPopup();
    }

    resetPopup = async () => {
        await this.setState({
            popupOpen: false,
            popup: {
                active: '',
                step: 1,
                data: '',
                gasLimit: '',
                password: '',
                hash: '',
                success: false
            }
        });
    };

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        await this.setState({ popupOpen: false });
    };

    getApps = async () => {
        const { address, url } = this.props;
        this.props.startLoading();
        try {
            const response = (await axios({
                method: 'post',
                url: `${url}/api/get-apps-by-developer`,
                data: {
                    address: address
                }
            })).data;
            const apps = response.result;

            if (apps.length !== 0) {
                // console.log('apps:', apps);
                const loadedApps = apps.filter(app => !!app.hash);
                loadedApps.forEach(item=> {
                    item.SERVICE = {
                        isExtend: false
                    }
                });
                // let notLoadedApps = apps.filter(app => app.loadFile === false);

                await this.setState({
                    apps: apps,
                    loadedApps: loadedApps,
                    // notLoadedApps: notLoadedApps
                });
                this.props.endLoading();
            } else {
                this.props.history.push('/app-add');
                this.props.endLoading();
            }
        } catch (err) {
            this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
    };

    handleChangeTxParams = param => async e => {
        await this.setState({
            popup: {
                ...this.state.popup,
                [param]: e.target.value
            }
        });
    };
    
    handleChangeDataParams = param => async e => {
        await this.setState({
            data: {
                ...this.state.data,
                [param]: e.target.value
            }
        });
    };

    handleClickChangePrice = idApp => async e => {
        e.preventDefault();
        await this.resetPopup();
        let { address } = this.props;
        let { loadedApps } = this.state;
        let balance = await getBalance(address);
        let app = loadedApps.find(app => app.idApp === idApp);

        await this.setState({
            popupOpen: true,
            balance: balance,
            popup: {
                ...this.state.popup,
                active: 'changePrice'
            },
            data: {
                ...this.state.data,
                app: app,
                price: parseInt(app.price, 10) / 100
            }
        });
    };
    handleSubmitChangePrice_1 = async e => {
        e.preventDefault();
        let { address, contracts } = this.props;
        let { price, app } = this.state.data;

        this.props.startLoading();
        try {
            let data = await getDataByTypes({
                name: 'setPrice',
                type: 'function',
                inputs: [
                    {
                        "name": "_app",
                        "type": "uint256"
                    },
                    {
                        "name": "_obj",
                        "type": "uint256"
                    },
                    {
                        "name": "_price",
                        "type": "uint256"
                    }
                ],
                params: [app.idApp, 0, price * 100]
            });
            let gasLimit = await getGasLimit({
                from: address,
                contract: contracts.PlayMarket,
                data: data,
                reserve: 0
            });
            await this.setState({
                popup: {
                    ...this.state.popup,
                    step: 2,
                    data: data,
                    gasLimit: gasLimit
                }
            });
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
    };
    handleSubmitChangePrice_2 = async e => {
        e.preventDefault();
        await this.setState({
            popup: {
                ...this.state.popup,
                step: 3
            }
        });
    };
    handleSubmitChangePrice_3 = async e => {
        e.preventDefault();
        const { gasPrice, address, mode, contracts } = this.props;
        const { data, gasLimit } = this.state.popup;
        this.props.startLoading();
        let tx;
        switch (mode) {
            case 'keystore':
                const { keystore } = this.props;
                const { password } = this.state.popup;
                try {
                    const wallet = await getWallet(keystore, password);
                    const signedTransaction = await getSignedTransaction({
                        wallet: wallet,
                        contract: contracts.PlayMarket,
                        data: data,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice
                    });
                    tx = await sendSignedTransaction(signedTransaction.rawTransaction);
                } catch (err) {
                    this.props.endLoading();
                    console.error(err);
                    Notification('error', 'Transaction failed');
                    return;
                }
                break;
            case 'metamask':
                try {
                    const txParams = await getTxParams({
                        contract: contracts.PlayMarket,
                        data: data,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice,
                        from: address
                    });
                    tx = await sendTransaction_MM(txParams);
                } catch (err) {
                    this.props.endLoading();
                    console.error(err);
                    Notification('error', 'Transaction failed');
                    return;
                }
                break;
            default:
                Notification('error', 'Mode is not selected');
                break;
        }
        try {
            const balance = await getBalance(address);
            await this.setState({
                balance: balance,
                popup: {
                    ...this.state.popup,
                    hash: tx.transactionHash
                }
            });
            await this.setState({
                popup: {
                    ...this.state.popup,
                    success: true
                }
            });
        } catch (err) {
            this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
        this.props.endLoading();
    };
    handleSubmitChangePrice_4 = async e => {
        e.preventDefault();
        await this.resetPopup();
    };

    handleClickChangePublish = idApp => async e => {
        e.preventDefault();
        await this.resetPopup();
        let { address, contracts } = this.props;
        let { loadedApps } = this.state;

        let app = loadedApps.find(app => app.idApp === idApp);
        let balance = await getBalance(address);

        this.props.startLoading();
        try {
            let data = await getData({
                contract: contracts.PlayMarket,
                method: 'changePublish',
                params: [app.idApp, !app.publish]
            });
            let gasLimit = await getGasLimit({
                from: address,
                contract: contracts.PlayMarket,
                data: data,
                reserve: 0
            });
            await this.setState({
                popupOpen: true,
                balance: balance,
                popup: {
                    ...this.state.popup,
                    active: 'changePublish',
                    step: 1,
                    data: data,
                    gasLimit: gasLimit
                },
                data: {
                    ...this.state.data,
                    app: app,
                    publish: !app.publish
                }
            });
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };

    handleSubmitChangePublish_1 = async e => {
        e.preventDefault();
        await this.setState({
            popup: {
                ...this.state.popup,
                step: 2
            }
        });
    };
    handleSubmitChangePublish_2 = async e => {
        e.preventDefault();
        const { gasPrice, address, mode, contracts } = this.props;
        const { data, gasLimit } = this.state.popup;
        this.props.startLoading();
        let tx;
        switch (mode) {
            case 'keystore':
                const { keystore } = this.props;
                const { password } = this.state.popup;
                try {
                    const wallet = await getWallet(keystore, password);
                    const signedTransaction = await getSignedTransaction({
                        wallet: wallet,
                        contract: contracts.PlayMarket,
                        data: data,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice
                    });
                    tx = await sendSignedTransaction(signedTransaction.rawTransaction);
                } catch (err) {
                    this.props.endLoading();
                    console.error(err);
                    Notification('error', err.message);
                    return;
                }
                break;
            case 'metamask':
                try {
                    const txParams = await getTxParams({
                        contract: contracts.PlayMarket,
                        data: data,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice,
                        from: address
                    });
                    tx = await sendTransaction_MM(txParams);
                } catch (err) {
                    this.props.endLoading();
                    console.error(err);
                    Notification('error', err.message);
                    return;
                }
                break;
            default:
                Notification('error', 'Mode is not selected');
                break;
        }
        try {
            const balance = await getBalance(address);
            await this.setState({
                balance: balance,
                popup: {
                    ...this.state.popup,
                    hash: tx.transactionHash
                }
            });
        } catch (err) {
            this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
        this.props.endLoading();
    };
    handleSubmitChangePublish_3 = async e => {
        e.preventDefault();
        await this.resetPopup();
    };

    handleClickBack_1 = async () => {
        await this.setState({
            popup: {
                ...this.state.popup,
                step: 1
            }
        });
    };
    handleClickBack_2 = async () => {
        await this.setState({
            popup: {
                ...this.state.popup,
                step: 2
            }
        });
    };

    handleClickToggleExtend = index => async e => {
        e.preventDefault();
        let { loadedApps } = this.state;
        loadedApps[index].SERVICE.isExtend = !loadedApps[index].SERVICE.isExtend;
        await this.setState({
            loadedApps: loadedApps
        });
    };

    handleClickRefresh = async e => {
        e.preventDefault();
        await this.getApps();
    };

    render(){
        let { loadedApps, popupOpen, balance, popup, data } = this.state;
        let { address, gasPrice, mode, url } = this.props;

        return (
            <div className="apps">
                <Helmet>
                    <title>Apps | Play Market 2.0 Developer Module</title>
                </Helmet>
                <div className="apps__header">
                    <div className="apps__header--left">
                        <div className="apps__header__title">Your applications</div>
                        <div className="apps__header__refresh" onClick={this.handleClickRefresh}></div>
                    </div>
                    <div className="apps__header--right">
                        <Link className="apps__header__add" to='/app-add' title="Add new application"></Link>
                    </div>
                </div>
                <div className="apps__body">
                    {
                        loadedApps.length ? (
                            <ul className="apps__body__list">
                                {
                                    loadedApps.map((app, index) => {
                                        return (
                                            <li className="apps__body__list-item" key={app.idApp}>
                                                <ul className="apps__body__list-item__head">
                                                    <li className="apps__body__list-item__head-item" data-section="logo"></li>
                                                    <li className="apps__body__list-item__head-item" data-section="name">name</li>
                                                    <li className="apps__body__list-item__head-item" data-section="status">status</li>
                                                    <li className="apps__body__list-item__head-item" data-section="more"></li>
                                                </ul>
                                                <ul className="apps__body__list-item__main">
                                                    <li className="apps__body__list-item__main-item" data-section="logo">
                                                        <img src={`${url}/data/${app.hashType}/${app.hash}/${app.files.images.logo}`} alt="LOGO"/>
                                                    </li>
                                                    <li className="apps__body__list-item__main-item" data-section="name">
                                                        {app.nameApp.length ? app.nameApp : <span>Not specified</span>}
                                                    </li>
                                                    <li className="apps__body__list-item__main-item" data-section="status">
                                                        <span className={app.publish ? 'active' : null}>{app.publish ? 'ACTIVE' : 'NOT ACTIVE'}</span>
                                                    </li>
                                                    <li className="apps__body__list-item__main-item" data-section="more">
                                                        <button onClick={this.handleClickToggleExtend(index)} title="More"></button>
                                                    </li>
                                                </ul>
                                                <div className={'apps__body__list-item__dropdown ' + (app.SERVICE.isExtend ? 'visible' : '')}>
                                                    <div className="apps__body__list-item__dropdown__info">
                                                        <ul className="apps__body__list-item__dropdown__info-main">
                                                            <li className="apps__body__list-item__dropdown__info-main__item">Confirmed:&nbsp;<span>{app.confirmation ? 'YES' : 'NO'}</span></li>
                                                            <li className="apps__body__list-item__dropdown__info-main__item">Publish:&nbsp;<span>{app.publish ? 'YES' : 'NO'}</span><div className="apps__body__list-item__dropdown__info-main__item__edit" onClick={this.handleClickChangePublish(app.idApp)}></div></li>
                                                            <li className="apps__body__list-item__dropdown__info-main__item">Price:&nbsp;<span>{parseInt(app.price, 10) / 100}</span><div className="apps__body__list-item__dropdown__info-main__item__edit" onClick={this.handleClickChangePrice(app.idApp)}></div></li>
                                                        </ul>
                                                        <ul className="apps__body__list-item__dropdown__info-tech">
                                                            <li className="apps__body__list-item__dropdown__info-tech__item">App ID:&nbsp;<span>{app.idApp}</span></li>
                                                            <li className="apps__body__list-item__dropdown__info-tech__item">Package name:&nbsp;<span>{app.packageName}</span></li>
                                                            <li className="apps__body__list-item__dropdown__info-tech__item">Version code:&nbsp;<span>{app.version}</span></li>
                                                            <li className="apps__body__list-item__dropdown__info-tech__item">Hash type:&nbsp;<span>{app.hashType === '1' ? '1 (IPFS)' : app.hashType + ' (unknown store)'}</span></li>
                                                            <li className="apps__body__list-item__dropdown__info-tech__item">Hash:&nbsp;<span>{app.hash}</span></li>
                                                        </ul>
                                                    </div>
                                                    <ul className="apps__body__list-item__dropdown__links">
                                                        {/*<li className="apps__body__list-item__dropdown__links-item">*/}
                                                            {/*<Link to={`/app/${app.idApp}`}>app</Link>*/}
                                                        {/*</li>*/}
                                                        <li className="apps__body__list-item__dropdown__links-item">
                                                            <Link to={`/update-apk/${app.idApp}`}>update apk</Link>
                                                        </li>
                                                        {
                                                            !app.icoRelease ? (
                                                                <li className="apps__body__list-item__dropdown__links-item">
                                                                    <Link to={`/ico-add/${app.idApp}`}>start ico</Link>
                                                                </li>
                                                            ) : null
                                                        }
                                                    </ul>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        ) : (
                            <div className="apps__body__placeholder">You don't have downloaded apps</div>
                        )
                    }
                </div>
                <Popup className="apps-popup" open={popupOpen} onClose={this.closeModal}>
                    <div>
                        <div>
                            <div className="apps-popup__main">
                                <h3 className="apps-popup__main__title">Account info</h3>
                                <ul className="apps-popup__main__list">
                                    <li className="apps-popup__main__list-item">
                                        <div className="apps-popup__main__list-item__title">Address:</div>
                                        <div className="apps-popup__main__list-item__value">{address}</div>
                                    </li>
                                    <li className="apps-popup__main__list-item">
                                        <div className="apps-popup__main__list-item__title">Balance:</div>
                                        <div className="apps-popup__main__list-item__value">{web3Utils.fromWei(balance, 'ether')} <span>ETH</span></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            {
                                popup.active === 'changePrice' ? (
                                    <div className="header-popup__action">
                                        <div className="header-popup__action__title">Change price</div>
                                        {
                                            popup.success ? (
                                                <form className="header-popup__changeInfo"
                                                      onSubmit={this.handleSubmitChangePrice_4}>
                                                    <h3 className="header-popup__changeInfo__title">Application settings
                                                        was successfully changed! After few moments in the list of apps
                                                        will show the relevant information.</h3>
                                                    <div
                                                        className="header-popup__btn-block header-popup__btn-block--center">
                                                        <button className="header-popup__btn-block__btn">OK</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div>
                                                    {
                                                        popup.step === 1 ? (
                                                            <form className="header-popup__changeInfo"
                                                                  onSubmit={this.handleSubmitChangePrice_1}>
                                                                <div className="header-popup__changeInfo__title">Please,
                                                                    fill in a form to continue.
                                                                </div>
                                                                <ul className="header-popup__changeInfo__list">
                                                                    <li className="header-popup__changeInfo__list-item">
                                                                        <div
                                                                            className="header-popup__changeInfo__list-item__title">
                                                                            Price:
                                                                        </div>
                                                                        <input
                                                                            className="header-popup__changeInfo__list-item__input"
                                                                            type="number" min="0" value={data.price}
                                                                            onChange={this.handleChangeDataParams('price')}/>
                                                                    </li>
                                                                </ul>
                                                                <div className="header-popup__btn-block">
                                                                    <button className="header-popup__btn-block__btn">
                                                                        continue
                                                                    </button>
                                                                    <div
                                                                        className="header-popup__btn-block__btn--cancel"
                                                                        onClick={this.closeModal}>Cancel
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        ) : null
                                                    }
                                                    {
                                                        popup.step === 2 ? (
                                                            <form className="header-popup__changeInfo"
                                                                  onSubmit={this.handleSubmitChangePrice_2}>
                                                                <div className="header-popup__changeInfo__title">
                                                                    Confirmation of the transaction data
                                                                </div>
                                                                <ul className="header-popup__changeInfo__preview-list">
                                                                    <li className="header-popup__changeInfo__preview-list__item">
                                                                        <div
                                                                            className="header-popup__changeInfo__preview-list__item--title">
                                                                            Price:
                                                                        </div>
                                                                        <div
                                                                            className="header-popup__changeInfo__preview-list__item--value">{data.price}</div>
                                                                    </li>
                                                                </ul>
                                                                <ul className="header-popup__changeInfo__list">
                                                                    <li className="header-popup__changeInfo__list-item">
                                                                        <div
                                                                            className="header-popup__changeInfo__list-item__title">
                                                                            Gas Limit:
                                                                        </div>
                                                                        <input
                                                                            className="header-popup__changeInfo__list-item__input"
                                                                            required type="number"
                                                                            value={popup.gasLimit}
                                                                            onChange={this.handleChangeTxParams('gasLimit')}/>
                                                                    </li>
                                                                </ul>
                                                                <ul className="header-popup__changeInfo__fee-list">
                                                                    <li className="header-popup__changeInfo__fee-list__item">
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--title">
                                                                            Gas Price:
                                                                        </div>
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')}
                                                                            Gwei
                                                                        </div>
                                                                    </li>
                                                                    <li className="header-popup__changeInfo__fee-list__item">
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--title">
                                                                            Approximate fee:
                                                                        </div>
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--value">{web3Utils.fromWei((gasPrice * popup.gasLimit).toString(), 'ether')}</div>
                                                                    </li>
                                                                </ul>
                                                                <div className="header-popup__btn-block">
                                                                    <button className="header-popup__btn-block__btn">
                                                                        Accept
                                                                    </button>
                                                                    <div
                                                                        className="header-popup__btn-block__btn--cancel"
                                                                        onClick={this.handleClickBack_1}>Back
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        ) : null
                                                    }
                                                    {
                                                        popup.step === 3 ? (
                                                            <form className="header-popup__changeInfo"
                                                                  onSubmit={this.handleSubmitChangePrice_3}>
                                                                <div className="header-popup__changeInfo__title">Sending
                                                                    transaction
                                                                </div>
                                                                {
                                                                    mode === 'keystore' ? (
                                                                        <ul className="header-popup__changeInfo__list">
                                                                            <li className="header-popup__changeInfo__list-item">
                                                                                <div
                                                                                    className="header-popup__changeInfo__list-item__title">
                                                                                    Keystore password:
                                                                                </div>
                                                                                <input
                                                                                    className="header-popup__changeInfo__list-item__input"
                                                                                    required type="password"
                                                                                    value={popup.password}
                                                                                    onChange={this.handleChangeTxParams('password')}/>
                                                                            </li>
                                                                        </ul>
                                                                    ) : null
                                                                }
                                                                <div className="header-popup__btn-block">
                                                                    <button className="header-popup__btn-block__btn">
                                                                        send tx
                                                                    </button>
                                                                    <div
                                                                        className="header-popup__btn-block__btn--cancel"
                                                                        onClick={this.handleClickBack_2}>Back
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        ) : null
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : null
                            }
                            {
                                popup.active === 'changePublish' ? (
                                    <div className="header-popup__action">
                                        <div className="header-popup__action__title">Change publish</div>
                                        {
                                            popup.success ? (
                                                <form className="header-popup__changeInfo"
                                                      onSubmit={this.handleSubmitChangePublish_3}>
                                                    <h3 className="header-popup__changeInfo__title">Application settings
                                                        was successfully changed! After few moments in the list of apps
                                                        will show the relevant information.</h3>
                                                    <div
                                                        className="header-popup__btn-block header-popup__btn-block--center">
                                                        <button className="header-popup__btn-block__btn">OK</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div>
                                                    {
                                                        popup.step === 1 ? (
                                                            <form className="header-popup__changeInfo"
                                                                  onSubmit={this.handleSubmitChangePublish_1}>
                                                                <div className="header-popup__changeInfo__title">
                                                                    Confirmation of the transaction data
                                                                </div>
                                                                <ul className="header-popup__changeInfo__preview-list">
                                                                    <li className="header-popup__changeInfo__preview-list__item">
                                                                        <div
                                                                            className="header-popup__changeInfo__preview-list__item--title">
                                                                            Publish:
                                                                        </div>
                                                                        <div
                                                                            className="header-popup__changeInfo__preview-list__item--value">{data.publish ? 'YES' : 'NO'}</div>
                                                                    </li>
                                                                </ul>
                                                                <ul className="header-popup__changeInfo__list">
                                                                    <li className="header-popup__changeInfo__list-item">
                                                                        <div
                                                                            className="header-popup__changeInfo__list-item__title">
                                                                            Gas Limit:
                                                                        </div>
                                                                        <input
                                                                            className="header-popup__changeInfo__list-item__input"
                                                                            required type="number"
                                                                            value={popup.gasLimit}
                                                                            onChange={this.handleChangeTxParams('gasLimit')}/>
                                                                    </li>
                                                                </ul>
                                                                <ul className="header-popup__changeInfo__fee-list">
                                                                    <li className="header-popup__changeInfo__fee-list__item">
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--title">
                                                                            Gas Price:
                                                                        </div>
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')}
                                                                            Gwei
                                                                        </div>
                                                                    </li>
                                                                    <li className="header-popup__changeInfo__fee-list__item">
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--title">
                                                                            Approximate fee:
                                                                        </div>
                                                                        <div
                                                                            className="header-popup__changeInfo__fee-list__item--value">{web3Utils.fromWei((gasPrice * popup.gasLimit).toString(), 'ether')}</div>
                                                                    </li>
                                                                </ul>
                                                                <div className="header-popup__btn-block header-popup__btn-block--center">
                                                                    <button className="header-popup__btn-block__btn">
                                                                        Accept
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        ) : null
                                                    }
                                                    {
                                                        popup.step === 2 ? (
                                                            <form className="header-popup__changeInfo"
                                                                  onSubmit={this.handleSubmitChangePublish_2}>
                                                                <div className="header-popup__changeInfo__title">Sending
                                                                    transaction
                                                                </div>
                                                                {
                                                                    mode === 'keystore' ? (
                                                                        <ul className="header-popup__changeInfo__list">
                                                                            <li className="header-popup__changeInfo__list-item">
                                                                                <div
                                                                                    className="header-popup__changeInfo__list-item__title">
                                                                                    Keystore password:
                                                                                </div>
                                                                                <input
                                                                                    className="header-popup__changeInfo__list-item__input"
                                                                                    required type="password"
                                                                                    value={popup.password}
                                                                                    onChange={this.handleChangeTxParams('password')}/>
                                                                            </li>
                                                                        </ul>
                                                                    ) : null
                                                                }
                                                                <div className="header-popup__btn-block">
                                                                    <button className="header-popup__btn-block__btn">
                                                                        send tx
                                                                    </button>
                                                                    <div
                                                                        className="header-popup__btn-block__btn--cancel"
                                                                        onClick={this.handleClickBack_1}>Back
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        ) : null
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </Popup>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        address: state.user.address,
        url: state.node.url,
        gasPrice: state.gasPrice,
        keystore: state.user.keystore,
        mode: state.mode,
        contracts: state.contracts
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Apps)