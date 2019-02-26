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

class AppUpdate extends Component {
    state = {
        app: null,
        popupOpen: false,
        _: {
            step: 1,
            data: '',
            gasLimit: '',
            password: '',
            success: false
        },
        balance: '',
        isUpload: true,
        hashType: '',
        hash: ''
    };

    async componentDidMount(){
        const { url, idApp, address } = this.props;
        await this.props.startLoading();
        try {
            const response = (await axios({
                method: 'post',
                url: `${url}/api/get-app-for-developer`,
                data: {
                    idApp: idApp
                }
            })).data;
            this.setState({
                app: response.result
            });

            const response2 = (await axios({
                method: 'get',
                url: '/api/download',
                params: {
                    address: address,
                    multihash: response.result.hash
                }
            })).data;
            console.log('response2:', response2);

            await this.props.endLoading();
        } catch (err) {
            await this.props.endLoading();
            Notification('error', err.message);
        }
    }

    render(){
        const { app } = this.state;
        const { gasPrice, mode, address } = this.props;

        return (
            <div className="update">
                {
                    app ? (
                        <div>id: {app.idApp}</div>
                    ): null
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

export default connect(mapStateToProps, mapDispatchToProps)(AppUpdate)