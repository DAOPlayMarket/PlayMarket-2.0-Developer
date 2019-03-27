import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";
import filesize from 'filesize';
import Popup from "reactjs-popup";
import TextareaAutosize from 'react-textarea-autosize';
import { Link } from 'react-router-dom'
import {utils as web3Utils} from 'web3';

import { startLoading, endLoading } from '../actions/preloader';

import Notification from '../components/Notification';

import { sendTransaction_MM, getTxParams, getWallet, sendSignedTransaction, getBalance, getData, getGasLimit, getSignedTransaction } from '../utils/web3'

class AppUpdateAPK extends Component {
    state = {
        app: null,
        config: null,
        popupOpen: false,
        data: {
            apk: null,
            description: ''
        },
        _: {
            step: 1,
            data: '',
            gasLimit: '',
            password: '',
            success: false
        },
        balance: '',
        isUpload: false,
        hashType: '',
        hash: ''
    };

    async componentDidMount(){
        const { url, idApp, address } = this.props;
        await this.props.startLoading();
        try {
            const app = (await axios({
                method: 'post',
                url: `${url}/api/get-app-for-developer`,
                data: {
                    idApp: idApp
                }
            })).data;
            await this.setState({
                app: app.result
            });

            const config = (await axios({
                method: 'get',
                url: '/api/download',
                params: {
                    address: address,
                    multihash: app.result.hash
                }
            })).data;
            await this.setState({
                config: config
            });

            await this.props.endLoading();
        } catch (err) {
            await this.props.endLoading();
            Notification('error', err.message);
        }
    }

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        await this.setState({ popupOpen: false });
    };

    handleChangeAPK = async e => {
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type === 'application/vnd.android.package-archive') {
                this.setState({data: {...this.state.data, apk: file}});
            } else {
                e.target.value = '';
                this.setState({data: {...this.state.data, apk: null}});
                Notification('error', 'Invalid application file');
            }
        } else {
            this.setState({data: {...this.state.data, apk: null}});
        }
    };
    handleChangeDesc = async e => {
        await this.setState({data: {...this.state.data, description: e.target.value}});
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            let { address, contracts } = this.props;
            let { apk, description } = this.state.data;
            let { app } = this.state;

            let fd = new FormData();

            fd.append("apk", apk);
            fd.append("description", description);

            let response = (await axios({
                method: 'post',
                url: '/api/update-apk',
                headers: {'address': address},
                data: fd
            })).data;
            if (response.status === 200) {
                try {
                    const data = await getData({
                        contract: contracts.PlayMarket,
                        method: 'changeHashApp',
                        params: [app.idApp, response.result.hash, response.result.hashType]
                    });
                    const gasLimit = await getGasLimit({
                        from: address,
                        contract: contracts.PlayMarket,
                        data: data,
                        reserve: 0
                    });
                    const balance = await getBalance(address);
                    await this.setState({
                        _: {
                            ...this.state._,
                            step: 1,
                            data: data,
                            gasLimit: gasLimit
                        },
                        balance: balance,
                        isUpload: true,
                        hashType: response.result.hashType,
                        hash: response.result.hash
                    });
                    await this.openModal();
                } catch (err) {
                    Notification('error', err.message);
                }
            } else if (response.status === 400) {
                Notification('warn', response.message);
            } else {
                Notification('error', response.message);
            }
        } catch (err) {
            Notification('error', err.message);
        }
        this.props.endLoading();
    };
    handleChangeTxParams = param => async e => {
        await this.setState({
            _: {
                ...this.state._,
                [param]: e.target.value
            }
        });
    };

    handleClickBackRegistration_1 = async () => {
        await this.setState({
            _: {
                ...this.state._,
                step: 1
            }
        });
    };

    handleSubmitRegistration_1 = async e => {
        e.preventDefault();
        await this.setState({
            _: {
                ...this.state._,
                step: 2,
                password: ''
            }
        });
    };
    handleSubmitRegistration_2 = async e => {
        e.preventDefault();
        const { gasPrice, address, mode, contracts } = this.props;
        const { data, gasLimit } = this.state._;
        this.props.startLoading();
        let tx;
        switch (mode) {
            case 'keystore':
                const { keystore } = this.props;
                const { password } = this.state._;
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
                break;
        }
        try {
            const balance = await getBalance(address);
            await this.setState({
                balance: balance,
                _: {
                    ...this.state._,
                    hash: tx.transactionHash
                }
            });
            await this.setState({
                _: {
                    ...this.state._,
                    success: true
                }
            });
        } catch (err) {
            console.error(err);
            Notification('error', err.message);
        }
        this.props.endLoading();
    };
    handleSubmitRegistration_3 = async e => {
        e.preventDefault();
        this.props.history.push('/apps');
    };

    render(){
        const { app, config, popupOpen, balance, hashType, hash, isUpload, data} = this.state;
        const { step, gasLimit, success, password } = this.state._;
        const { gasPrice, mode, address } = this.props;

        return (
            <div className="update-apk">
                {
                    app && config ? (
                        <div>
                            <Helmet>
                                <title>Update APK "{app.nameApp}" | Play Market 2.0 Developer Module</title>
                            </Helmet>
                            <div className="ico-add__control">
                                <Link className="ico-add__control__back" to="/apps">Applications</Link>
                            </div>
                            <div className="ico-add__title">Update APK for <span>{app.nameApp}</span></div>
                            <form onSubmit={this.handleSubmitUpload}>
                                <div className="update-apk__sections">
                                    <section className="update-apk__section">
                                        <div className="update-apk__section__title">Application file</div>
                                        <div className="update-apk__section__file">
                                            {
                                                data.apk ? (
                                                    <div className="update-apk__section__file__preview">
                                                        <div className="update-apk__section__file__preview__img"></div>
                                                        <ul className="update-apk__section__file__preview__info-list">
                                                            <li className="update-apk__section__file__preview__info-list__item">Name: <span>{data.apk.name}</span></li>
                                                            <li className="update-apk__section__file__preview__info-list__item">Size: <span>{filesize(data.apk.size)}</span></li>
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="update-apk__section__file__preview__placeholder">Select APK file</div>
                                                )
                                            }
                                            <input required type="file" name="apk" accept=".apk" onChange={this.handleChangeAPK}/>
                                        </div>
                                    </section>
                                    <section className="update-apk__section">
                                        <div className="update-apk__section__title">Description of changes</div>
                                        <div className="update-apk__section__text">
                                            <TextareaAutosize placeholder="New features, more stable" minRows={1} value={data.description} onChange={this.handleChangeDesc}/>
                                        </div>
                                    </section>
                                </div>
                                <div className="update-apk__load-block">
                                    <button className="update-apk__load-block__btn">Upload</button>
                                </div>
                            </form>
                            <Popup className="update-apk-popup" open={popupOpen} onClose={this.closeModal}>
                                <div>
                                    {
                                        isUpload ? (
                                            <div>
                                                <div className="update-apk-popup__main">
                                                    <h3 className="update-apk-popup__main__title">Account info</h3>
                                                    <ul className="update-apk-popup__main__list">
                                                        <li className="update-apk-popup__main__list-item">
                                                            <div className="update-apk-popup__main__list-item__title">Address:</div>
                                                            <div className="update-apk-popup__main__list-item__value">{address}</div>
                                                        </li>
                                                        <li className="update-apk-popup__main__list-item">
                                                            <div className="update-apk-popup__main__list-item__title">Balance:</div>
                                                            <div className="update-apk-popup__main__list-item__value">{web3Utils.fromWei(balance, 'ether')} <span>ETH</span></div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {
                                                    success ? (
                                                        <form className="update-apk-popup__registration" onSubmit={this.handleSubmitRegistration_3}>
                                                            <h3 className="update-apk-popup__registration__title">app update</h3>
                                                            <div className="update-apk-popup__registration__subtitle">Your application is successfully updated!<br/>After moderation new version will appear in platform.</div>
                                                            <div className="update-apk-popup__btn-block update-apk-popup__btn-block--center">
                                                                <button className="update-apk-popup__btn-block__btn">OK</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div>
                                                            {
                                                                step === 1 ? (
                                                                    <form className="update-apk-popup__registration"
                                                                          onSubmit={this.handleSubmitRegistration_1}>
                                                                        <h3 className="update-apk-popup__registration__title">app update</h3>
                                                                        <div className="update-apk-popup__registration__subtitle">
                                                                            Confirmation of the transaction data
                                                                        </div>
                                                                        <ul className="update-apk-popup__registration__preview-list">
                                                                            <li className="update-apk-popup__registration__preview-list__item">
                                                                                <div
                                                                                    className="update-apk-popup__registration__preview-list__item--title">
                                                                                    Hash:
                                                                                </div>
                                                                                <div
                                                                                    className="update-apk-popup__registration__preview-list__item--value">{hash}</div>
                                                                            </li>
                                                                            <li className="update-apk-popup__registration__preview-list__item">
                                                                                <div
                                                                                    className="update-apk-popup__registration__preview-list__item--title">
                                                                                    Hash type:
                                                                                </div>
                                                                                <div
                                                                                    className="update-apk-popup__registration__preview-list__item--value">{hashType}</div>
                                                                            </li>
                                                                        </ul>
                                                                        <ul className="update-apk-popup__registration__list">
                                                                            <li className="update-apk-popup__registration__list-item">
                                                                                <div
                                                                                    className="update-apk-popup__registration__list-item__title">
                                                                                    Gas Limit:
                                                                                </div>
                                                                                <input
                                                                                    className="update-apk-popup__registration__list-item__input"
                                                                                    required name="gasLimit" type="number"
                                                                                    value={gasLimit}
                                                                                    onChange={this.handleChangeTxParams('gasLimit')}/>
                                                                            </li>
                                                                        </ul>
                                                                        <ul className="update-apk-popup__registration__fee-list">
                                                                            <li className="update-apk-popup__registration__fee-list__item">
                                                                                <div
                                                                                    className="update-apk-popup__registration__fee-list__item--title">
                                                                                    Gas Price:
                                                                                </div>
                                                                                <div className="update-apk-popup__registration__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')} Gwei</div>
                                                                            </li>
                                                                            <li className="update-apk-popup__registration__fee-list__item">
                                                                                <div
                                                                                    className="update-apk-popup__registration__fee-list__item--title">
                                                                                    Approximate fee:
                                                                                </div>
                                                                                <div
                                                                                    className="update-apk-popup__registration__fee-list__item--value">{web3Utils.fromWei((gasPrice * gasLimit).toString(), 'ether')}</div>
                                                                            </li>
                                                                        </ul>
                                                                        <div className="update-apk-popup__btn-block">
                                                                            <button className="update-apk-popup__btn-block__btn">
                                                                                Accept
                                                                            </button>
                                                                            <div className="update-apk-popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                                        </div>
                                                                    </form>
                                                                ) : null
                                                            }
                                                            {
                                                                step === 2 ? (
                                                                    <form className="update-apk-popup__registration" onSubmit={this.handleSubmitRegistration_2}>
                                                                        <h3 className="update-apk-popup__registration__title">app update</h3>
                                                                        <div className="update-apk-popup__registration__subtitle">Sending transaction</div>
                                                                        {
                                                                            mode === 'keystore' ? (
                                                                                <ul className="update-apk-popup__registration__list">
                                                                                    <li className="update-apk-popup__registration__list-item">
                                                                                        <div
                                                                                            className="update-apk-popup__registration__list-item__title">
                                                                                            Keystore password:
                                                                                        </div>
                                                                                        <input
                                                                                            className="update-apk-popup__registration__list-item__input"
                                                                                            required name="password" type="password"
                                                                                            value={password}
                                                                                            onChange={this.handleChangeTxParams('password')}/>
                                                                                    </li>
                                                                                </ul>
                                                                            ) : null
                                                                        }
                                                                        <div className="update-apk-popup__btn-block">
                                                                            <button className="update-apk-popup__btn-block__btn">send tx</button>
                                                                            <div className="update-apk-popup__btn-block__btn--cancel" onClick={this.handleClickBackRegistration_1}>Back</div>
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
                            </Popup>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        idApp: ownProps.match.params.app_id,
        address: state.user.address,
        keystore: state.user.keystore,
        contracts: state.contracts,
        mode: state.mode,
        url: state.node.url,
        gasPrice: state.gasPrice
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AppUpdateAPK)