import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";
import Select from 'react-select'

import { startLoading, endLoading } from '../actions/preloader'

import { getWallet, getSignedTransaction, sendSignedTransaction, getTransactionStatus } from '../utils/web3'

import Notification from '../components/Notification';

class AppAdd extends Component {
    state = {
        hashTx: '',
        isUpload: false,
        isRegistered: false,
        password: '',
        select: {
            categories: [],
            subCategories: [],
            selectedOptionCategory: null,
            selectedOptionSubCategory: null
        },
        hash: '',
        hashTag: '',
        app: {
            nameApp: '',
            idCTG: null,
            subCategory: null,
            slogan: '',
            shortDescr: '',
            keywords: [],
            youtubeID: '',
            email: '',
            packageName: '',
            version: '',
            ageRestrictions: '',
            price: 0,
            publish: true,
            advertising: true,
            forChildren: false,
            urlApp: '',
            privacyPolicy: '',
            longDescr: '',
            gallery: [],
            banner: null,
            logo: null,
            apk: null
        }
    };

    async componentDidMount(){
        await this.formatterSelectCategories();
    }

    formatterSelectCategories = async () => {
        let { categories } = this.props;
        let arr = [];
        categories.map(category => {
            arr.push({value: category.id, label: category.name});
        });
        await this.setState({select: {...this.state.select, categories: arr}});
    };

    formatterSelectSubCategories = async () => {
        let { categories } = this.props;
        let { idCTG } = this.state.app;
        let subCategories = (categories.find(item => item.id === idCTG)).subcategories;
        let arr = [];
        subCategories.map(subcategory => {
            arr.push({value: subcategory.id, label: subcategory.name});
        });
        await this.setState({select: {...this.state.select, subCategories: []}});
        await this.setState({select: {...this.state.select, subCategories: arr}});
    };
    handleChangeCategory = async selectedOptionCategory  => {
        let value = parseInt(selectedOptionCategory.value, 10);
        if(value !== this.state.app.idCTG) {
            await this.setState({
                select: {...this.state.select, selectedOptionCategory, selectedOptionSubCategory: null},
                app: {...this.state.app, idCTG: value, subCategory: null}
            });
            await this.formatterSelectSubCategories();
        }
    };
    handleChangeSubCategory = async selectedOptionSubCategory => {
        let value = parseInt(selectedOptionSubCategory.value, 10);
        if(value !== this.state.app.subCategory) {
            await this.setState({
                select: {...this.state.select, selectedOptionSubCategory},
                app: {...this.state.app, subCategory: value}
            });
        }
    };

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
            this.setState({app: {...this.state.app, [name]: files}});
        } else {
            let file = e.target.files.length ? e.target.files[0] : null;
            this.setState({app: {...this.state.app, [name]: file}});
        }
    };
    handleChangeCheckbox = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({app: {...this.state.app, [name]: e.target.checked}});
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            let {address} = this.props;
            let { nameApp, idCTG, subCategory } = this.state.app;
            let { apk, logo, banner, gallery, slogan, shortDescr, keywords, youtubeID, email, packageName, version, ageRestrictions, price, publish, advertising, forChildren, urlApp, privacyPolicy, longDescr } = this.state.app;

            let fd = new FormData();

            fd.append("nameApp", nameApp);
            fd.append("idCTG", idCTG);
            fd.append("subCategory", subCategory);
            fd.append("slogan", slogan);
            fd.append("shortDescr", shortDescr);
            fd.append("keywords", keywords);
            fd.append("youtubeID", youtubeID);
            fd.append("email", email);
            fd.append("packageName", packageName);
            fd.append("version", version);
            fd.append("ageRestrictions", ageRestrictions);
            fd.append("price", parseInt(price, 10) * 10000);
            fd.append("publish", publish);
            fd.append("advertising", advertising);
            fd.append("forChildren", forChildren);
            fd.append("urlApp", urlApp);
            fd.append("privacyPolicy", privacyPolicy);
            fd.append("longDescr", longDescr);

            fd.append("apk", apk);
            fd.append("logo", logo);
            fd.append("banner", banner);
            for (let i = 0; i < gallery.length; i++) {
                fd.append("gallery", gallery[i]);
            }

            let response = (await axios({
                method: 'post',
                url: 'api/app-add',
                headers: {'address': address},
                data: fd
            })).data;
            this.props.endLoading();

            if (response.status === 200) {
                this.setState({isUpload: true, hashTag: response.result.hashTag, hash: response.result.hash});
            } else {
                Notification('error', response.result);
            }
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };
    handleSubmitRegistration = async e => {
        e.preventDefault();
        this.props.startLoading();
        let { keystore } = this.props;
        let { password, hash, hashTag } = this.state;
        let { price, publish } = this.state.app;

        try {
            let wallet = await getWallet(keystore, password);

            let signedTransaction = await getSignedTransaction({
                wallet: wallet,
                contract: 'main',
                data: {
                    method: 'registrationApplication',
                    params: [hash, hashTag, publish, (parseInt(price, 10) * 10000)]
                }
            });
            let tx = await sendSignedTransaction(signedTransaction.rawTransaction);
            let transactionStatus = await getTransactionStatus(tx.transactionHash);
            await this.setState({
                hashTx: tx.transactionHash
            });
            if (transactionStatus) {
                await this.setState({
                    isRegistered: true
                });
            } else {
                Notification('error', 'Transaction failed');
            }
        } catch (err) {
            Notification('error', err.message);
        }
        this.props.endLoading();
    };

    render(){
        const { selectedOptionCategory, selectedOptionSubCategory } = this.state.select;

        const { nameApp, slogan, shortDescr, keywords, youtubeID, email, packageName, version, ageRestrictions, price, publish, advertising, forChildren, urlApp, privacyPolicy, longDescr } = this.state.app;
        return (
            <div className="app-add">
                <Helmet>
                    <title>Add app | Play Market 2.0 Developer Module</title>
                </Helmet>
                {!this.state.isUpload ? (
                    <form onSubmit={this.handleSubmitUpload}>
                        <section>
                            <h3>Application name</h3>
                            <input required type="text" name='nameApp' value={nameApp} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Type</h3>
                            <Select options={this.state.select.categories} value={selectedOptionCategory} onChange={this.handleChangeCategory} placeholder="Select type"/>
                        </section>
                        <section>
                            <h3>Category</h3>
                            <Select options={this.state.select.subCategories} value={selectedOptionSubCategory} onChange={this.handleChangeSubCategory} placeholder="Select category"/>
                        </section>
                        <section>
                            <h3>APK file</h3>
                            <input required type="file" name="apk" accept=".apk" onChange={this.handleChangeFile}/>
                        </section>
                        <section>
                            <h3>Logo</h3>
                            <input required type="file" name="logo" accept=".png, .jpg, .jpeg" onChange={this.handleChangeFile}/>
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
                            <h3>Package name</h3>
                            <input required type="text" name='packageName' value={packageName} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>App version (integer)</h3>
                            <input required type="text" name='version' value={version} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Price (in standard unit, 0 - for free)</h3>
                            <input required type="text" name='price' value={price} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Slogan</h3>
                            <input type="text" name='slogan' value={slogan} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Brief description</h3>
                            <textarea type="text" name='shortDescr' value={shortDescr} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Detailed description</h3>
                            <textarea type="text" name='longDescr' value={longDescr} onChange={this.handleChangeText}/>
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
                            <h3>Age restrictions (minimum age)</h3>
                            <input required type="text" name='ageRestrictions' value={ageRestrictions} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Publish app after verification</h3>
                            <input className="input-checkbox" type="checkbox" name='publish' checked={publish} onChange={this.handleChangeCheckbox}/>
                        </section>
                        <section>
                            <h3>The app has ads</h3>
                            <input className="input-checkbox" type="checkbox" name='advertising' checked={advertising} onChange={this.handleChangeCheckbox}/>
                        </section>
                        <section>
                            <h3>The app is designed for children</h3>
                            <input className="input-checkbox" type="checkbox" name='forChildren' checked={forChildren} onChange={this.handleChangeCheckbox}/>
                        </section>
                        <section>
                            <h3>Link to application website</h3>
                            <input type="text" name='urlApp' value={urlApp} onChange={this.handleChangeText}/>
                        </section>
                        <section>
                            <h3>Link to privacy policy</h3>
                            <input type="text" name='privacyPolicy' value={privacyPolicy} onChange={this.handleChangeText}/>
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

const mapStateToProps = (state) => {
    return {
        // url: state.node.url,
        categories: state.categories,
        address: state.user.address,
        keystore: state.user.keystore
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AppAdd)