import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";

import { startLoading, endLoading } from '../actions/preloader'

import { getWallet, getSignedTransaction, sendSignedTransaction, getTransactionStatus } from '../utils/web3'

import Notification from '../components/Notification';

class IcoAdd extends Component {
    state = {
        // hashTx: '',
        // isUpload: false,
        // isRegistered: false,
        // password: '',
        // select: {
        //     categories: [],
        //     subCategories: [],
        //     selectedOptionCategory: null,
        //     selectedOptionSubCategory: null
        // },
        // hash: '',
        // hashTag: '',
        ico: {
            keywords: '',
            youtubeID: '',
            email: '',
            urlICO: '',
            privacyPolicy: '',
            description: '',
            advantages: '',
            social: {
                googlePlus: '',
                facebook: '',
                linkedin: '',
                instagram: '',
                vk: '',
                youtube: '',
                telegram: '',
                git: ''
            },
            files: {
                logo: null,
                gallery: [],
                banner: null,
                whitepaper: null,
                onepage: null
            },
            members: {
                team: [],
                advisors: []
            }
        }
    };

    async componentDidMount(){
        // console.log(this.props);
    }

    handleChangeText = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({app: {...this.state.app, [name]: e.target.value}});
    };
    handleChangePassword = async e => {
        await this.setState({password: e.target.value});
    };
    handleChangeFile = async e => {
        let multiple = e.target.getAttribute('multiple');
        let name = e.target.getAttribute('name');
        if (typeof multiple === 'string') {
            let files = e.target.files.length ? e.target.files : [];
            this.setState({ico: {...this.state.ico, [name]: files}});
        } else {
            let file = e.target.files.length ? e.target.files[0] : null;
            this.setState({app: {...this.state.app, [name]: file}});
        }
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            // let {address} = this.props;
            // let { nameApp, idCTG, subCategory } = this.state.app;
            // let { apk, logo, banner, gallery, slogan, shortDescr, keywords, youtubeID, email, packageName, version, ageRestrictions, price, publish, advertising, forChildren, urlApp, privacyPolicy, longDescr } = this.state.app;
            //
            // let fd = new FormData();
            //
            // fd.append("nameApp", nameApp);
            // fd.append("idCTG", idCTG);
            // fd.append("subCategory", subCategory);
            // fd.append("slogan", slogan);
            // fd.append("shortDescr", shortDescr);
            // fd.append("keywords", keywords);
            // fd.append("youtubeID", youtubeID);
            // fd.append("email", email);
            // fd.append("packageName", packageName);
            // fd.append("version", version);
            // fd.append("ageRestrictions", ageRestrictions);
            // fd.append("price", parseInt(price, 10) * 10000);
            // fd.append("publish", publish);
            // fd.append("advertising", advertising);
            // fd.append("forChildren", forChildren);
            // fd.append("urlApp", urlApp);
            // fd.append("privacyPolicy", privacyPolicy);
            // fd.append("longDescr", longDescr);
            //
            // fd.append("apk", apk);
            // fd.append("logo", logo);
            // fd.append("banner", banner);
            // for (let i = 0; i < gallery.length; i++) {
            //     fd.append("gallery", gallery[i]);
            // }
            //
            // let response = (await axios({
            //     method: 'post',
            //     url: 'api/app-add',
            //     headers: {'address': address},
            //     data: fd
            // })).data;
            // this.props.endLoading();
            //
            // if (response.status === 200) {
            //     this.setState({isUpload: true, hashTag: response.result.hashTag, hash: response.result.hash});
            // } else {
            //     Notification('error', response.result);
            // }
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };
    handleSubmitRegistration = async e => {
        e.preventDefault();
        // this.props.startLoading();
        // let { keystore } = this.props;
        // let { password, hash, hashTag } = this.state;
        // let { price, publish } = this.state.app;
        //
        // try {
        //     let wallet = await getWallet(keystore, password);
        //
        //     let signedTransaction = await getSignedTransaction({
        //         wallet: wallet,
        //         contract: 'main',
        //         data: {
        //             method: 'registrationApplication',
        //             params: [hash, hashTag, publish, (parseInt(price, 10) * 10000)]
        //         }
        //     });
        //     let tx = await sendSignedTransaction(signedTransaction.rawTransaction);
        //     let transactionStatus = await getTransactionStatus(tx.transactionHash);
        //     await this.setState({
        //         hashTx: tx.transactionHash
        //     });
        //     if (transactionStatus) {
        //         await this.setState({
        //             isRegistered: true
        //         });
        //     } else {
        //         Notification('error', 'Transaction failed');
        //     }
        // } catch (err) {
        //     Notification('error', err.message);
        // }
        // this.props.endLoading();
    };

    render(){
        let { app } = this.props.location.state;

        let { keywords, youtubeID, email, urlICO, privacyPolicy, description, advantages } = this.state.ico;
        return (
            <div className="app-add">
                <Helmet>
                    <title>Start ICO for "{app.nameApp}" | Play Market 2.0 Developer Module</title>
                </Helmet>
                <div>
                    <p>idApp: {app.idApp}</p>
                    <p>nameApp: {app.nameApp}</p>
                </div>
                {!this.state.isUpload ? (
                    <form onSubmit={this.handleSubmitUpload}>
                        <section>
                            <h3>Logo</h3>
                            <input type="file" name="logo" accept=".png, .jpg, .jpeg" onChange={this.handleChangeFile}/>
                        </section>
                        <section>
                            <h3>Gallery (multiple)</h3>
                            <input type="file" name="gallery" multiple accept=".png, .jpg, .jpeg" onChange={this.handleChangeFile}/>
                        </section>
                        <section>
                            <h3>Banner (horizontal image)</h3>
                            <input type="file" name="banner" accept=".png, .jpg, .jpeg" onChange={this.handleChangeFile}/>
                        </section>
                        <section>
                            <h3>Description</h3>
                            <textarea type="text" name='description' value={description} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Investor advantages</h3>
                            <input type="text" name='advantages' value={advantages} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Keywords (space separated)</h3>
                            <input type="text" name='keywords' value={keywords} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>YouTube video ID</h3>
                            <input type="text" name='youtubeID' value={youtubeID} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>EMAIL</h3>
                            <input type="text" name='email' value={email} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Link to ICO website</h3>
                            <input type="text" name='urlICO' value={urlICO} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Link to privacy policy</h3>
                            <input type="text" name='privacyPolicy' value={privacyPolicy} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>White Paper (pdf)</h3>
                            <input type="file" name="whitepaper" accept=".pdf" onChange={this.handleChangeFile}/>
                        </section>
                        <section>
                            <h3>One Page Paper (pdf)</h3>
                            <input type="file" name="onepage" accept=".pdf" onChange={this.handleChangeFile}/>
                        </section>
                        <button>Upload</button>
                    </form>
                ) : (!this.state.isRegistered ? (
                        <div>
                            <h2>Files successful uploaded to store!</h2>
                            <div>
                                <h3>Hash: {this.state.hash}</h3>
                                <h3>Hash Tag: {this.state.hashTag}</h3>
                            </div>
                            <form onSubmit={this.handleSubmitRegistration}>
                                <h2>Now, you can registration you app in smart contract</h2>
                                <input type="password" value={this.state.password} onChange={this.handleChangePassword} placeholder="Keystore password"/>
                                <button>Registration app</button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2>Your application is successfully registered!</h2>
                            <div>After moderation it will appear in your list of applications</div>
                        </div>
                    )
                )}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        // id: ownProps.match.params.app_id
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IcoAdd)