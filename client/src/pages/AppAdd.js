import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";
import TextareaAutosize from 'react-textarea-autosize';
import fileExtension from 'file-extension';
import $ from "jquery";
import filesize from 'filesize';
import Popup from "reactjs-popup";
import {utils as web3Utils} from 'web3';

import Select from 'react-select';

import { startLoading, endLoading } from '../actions/preloader'

import { getWallet, sendSignedTransaction, getTransactionStatus, getBalance, getData, getGasLimit, getSignedTransaction } from '../utils/web3'

import Notification from '../components/Notification';

class AppAdd extends Component {
    state = {
        TEST: '',
        popupOpen: false,
        hashTx: '',
        balance: '',
        isUpload: false,
        isRegistered: false,
        select: {
            categories: [],
            subCategories: [],
            selectedOptionCategory: null,
            selectedOptionSubCategory: null
        },
        hash: '',
        hashType: '',
        SERVICE: {
            gallery: [],
            logo: null,
            banner: null,
            keyword: '',
            select: {
                categories: [],
                subCategories: [],
                selectedOptionCategory: null,
                selectedOptionSubCategory: null
            }
        },
        registration: {
            step: 1,
            hash: '',
            password: ''
        },
        app: {
            nameApp: '',
            idCTG: '',
            subCategory: '',
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
            files: {
                gallery: [],
                banner: null,
                logo: null,
                apk: null
            }
        }
    };


    async componentDidMount(){
        await this.formatterSelectCategories();
    }

    preventEvent = e => {
        e.preventDefault();
    };

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        await this.setState({ popupOpen: false });
    };

    formatterSelectCategories = async () => {
        let { categories } = this.props;
        let arr = [];
        categories.forEach(category => {
            arr.push({value: category.id, label: category.name});
        });
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                select: {
                    ...this.state.SERVICE.select,
                    categories: arr
                }
            }
        });
    };
    formatterSelectSubCategories = async () => {
        let { categories } = this.props;
        let { idCTG } = this.state.app;
        let subCategories = (categories.find(item => item.id === idCTG)).subcategories;
        let arr = [];
        subCategories.forEach(subcategory => {
            arr.push({value: subcategory.id, label: subcategory.name});
        });
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                select: {
                    ...this.state.SERVICE.select,
                    subCategories: arr
                }
            }
        });
    };
    handleChangeCategory = async selectedOptionCategory  => {
        let { idCTG } = this.state.app;
        let value = parseInt(selectedOptionCategory.value, 10);
        if(value !== idCTG) {
            await this.setState({
                app: {
                    ...this.state.app,
                    idCTG: value,
                    subCategory: ''
                },
                SERVICE: {
                    ...this.state.SERVICE,
                    select: {
                        ...this.state.SERVICE.select,
                        selectedOptionCategory,
                        selectedOptionSubCategory: null
                    }
                }
            });
            await this.formatterSelectSubCategories();
        }
    };
    handleChangeSubCategory = async selectedOptionSubCategory => {
        let { subCategory } = this.state.app;
        let value = parseInt(selectedOptionSubCategory.value, 10);
        if(value !== subCategory) {
            await this.setState({
                app: {
                    ...this.state.app,
                    subCategory: value
                },
                SERVICE: {
                    ...this.state.SERVICE,
                    select: {
                        ...this.state.SERVICE.select,
                        selectedOptionSubCategory
                    }
                }
            });
        }
    };

    handleChangeText = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({app: {...this.state.app, [name]: e.target.value}});
    };

    handleChangeLogo = async e => {
        e.persist();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        app: {...this.state.app, files: {...this.state.app.files, logo: file}},
                        SERVICE: {...this.state.SERVICE, logo: {imageBase64: reader.result, name: file.name}}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                $(e.target).val('');
                await this.setState({
                    app: {...this.state.app, files: {...this.state.app.files, logo: null}},
                    SERVICE: {...this.state.SERVICE, logo: null}
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                app: {...this.state.app, files: {...this.state.app.files, logo: null}},
                SERVICE: {...this.state.SERVICE, logo: null}
            });
        }
    };
    handleChangeAPK = async e => {
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type === 'application/vnd.android.package-archive') {
                this.setState({app: {...this.state.app, files: {...this.state.app.files, apk: file}}});
            } else {
                $(e.target).val('');
                this.setState({app: {...this.state.app, files: {...this.state.app.files, apk: null}}});
                Notification('error', 'Invalid application file');
            }
        } else {
            this.setState({app: {...this.state.app, files: {...this.state.app.files, apk: null}}});
        }
    };
    handleChangeGallery = async e => {
        e.persist();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        app: {...this.state.app, files: {...this.state.app.files, gallery: [...this.state.app.files.gallery, file]}},
                        SERVICE: {...this.state.SERVICE, gallery: [...this.state.SERVICE.gallery, {imageBase64: reader.result, name: file.name}]}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                Notification('error', 'Invalid image file');
            }
        }
        $(e.target).val('');
    };
    handleRemoveGalleryItem = async e => {
        let index = $(e.target).data('index');

        let gallerySERVICE = this.state.app.files.gallery;
        gallerySERVICE.splice(index, 1);
        let galleryApp = this.state.SERVICE.gallery;
        galleryApp.splice(index, 1);

        await this.setState({
            app: {...this.state.app, files: {...this.state.app.files, gallery: gallerySERVICE}},
            SERVICE: {...this.state.SERVICE, gallery: galleryApp}
        });
    };
    handleChangeBanner = async e => {
        e.persist();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        app: {...this.state.app, files: {...this.state.app.files, banner: file}},
                        SERVICE: {...this.state.SERVICE, banner: {imageBase64: reader.result, name: file.name}}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                await this.setState({
                    app: {...this.state.app, files: {...this.state.app.files, banner: null}},
                    SERVICE: {...this.state.SERVICE, banner: null}
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                app: {...this.state.app, files: {...this.state.app.files, banner: null}},
                SERVICE: {...this.state.SERVICE, banner: null}
            });
        }
    };
    handleChangeKeyword = async e => {
        let value = e.target.value;
        await this.setState({
            SERVICE: {...this.state.SERVICE, keyword: value}
        });
    };
    handleAddKeyword = async e => {
        e.preventDefault();
        let { keyword } = this.state.SERVICE;
        if (!!keyword.length) {
            await this.setState({
                app: {...this.state.app, keywords: [...this.state.app.keywords, keyword]},
                SERVICE: {...this.state.SERVICE, keyword: ''}
            });
        }
    };
    handleRemoveKeyword = index => async e => {
        e.preventDefault();
        let _keywords = this.state.app.keywords;
        _keywords.splice(index, 1);
        await this.setState({
            app: {...this.state.app, keywords: _keywords}
        });
    };
    handleChangeCheckbox = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({app: {...this.state.app, [name]: e.target.checked}});
    };
    handleChangeTxParams = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({registration: {
            ...this.state.registration,
            [name]: e.target.value
        }});
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            let { address } = this.props;
            let { nameApp, idCTG, subCategory } = this.state.app;
            let { slogan, shortDescr, keywords, youtubeID, email, packageName, version, ageRestrictions, price, publish, advertising, forChildren, urlApp, privacyPolicy, longDescr } = this.state.app;
            let { apk, logo, banner, gallery } = this.state.app.files;

            let fd = new FormData();

            fd.append("nameApp", nameApp);
            fd.append("idCTG", idCTG);
            fd.append("subCategory", subCategory);
            fd.append("slogan", slogan);
            fd.append("shortDescr", shortDescr);

            fd.append("keywords", JSON.stringify(keywords));

            fd.append("youtubeID", youtubeID);
            fd.append("email", email);
            fd.append("packageName", packageName);
            fd.append("version", version);
            fd.append("ageRestrictions", ageRestrictions);
            fd.append("price", price * 10000);
            fd.append("publish", publish);
            fd.append("advertising", advertising);
            fd.append("forChildren", forChildren);
            fd.append("urlApp", urlApp);
            fd.append("privacyPolicy", privacyPolicy);
            fd.append("longDescr", longDescr);

            fd.append("apk", apk);
            fd.append("logo", logo, logo ? ('logo.' + fileExtension(logo.name)) : null);
            fd.append("banner", banner, banner ? ('banner.' + fileExtension(banner.name)) : null);
            for (let i = 0; i < gallery.length; i++) {
                fd.append("gallery", gallery[i], [i] + '.' + fileExtension(gallery[i].name));
            }

            let response = (await axios({
                method: 'post',
                url: '/api/app-add',
                headers: {'address': address},
                data: fd
            })).data;
            if (response.status === 200) {
                try {
                    let data = await getData({
                        contract: 'PlayMarket',
                        method: 'addApp',
                        params: [response.result.hashType, 1,  price * 10000, publish, response.result.hash]
                    });
                    let gasLimit = await getGasLimit({
                        from: address,
                        contract: 'PlayMarket',
                        data: data,
                        reserve: 0
                    });
                    let balance = await getBalance(address);
                    await this.setState({
                        registration: {
                            ...this.state.registration,
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
            } else {
                Notification('error', response.result);
            }
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    };

    handleClickBackRegistration_1 = async () => {
        await this.setState({
            registration: {
                ...this.state.registration,
                step: 1
            }
        });
    };

    handleSubmitRegistration_1 = async e => {
        e.preventDefault();
        await this.setState({
            registration: {
                ...this.state.registration,
                step: 2,
                password: ''
            }
        });
    };
    handleSubmitRegistration_2 = async e => {
        e.preventDefault();
        this.props.startLoading();
        let { keystore, gasPrice, address } = this.props;
        let { password, data, gasLimit } = this.state.registration;
        try {
            let wallet = await getWallet(keystore, password);
            let signedTransaction = await getSignedTransaction({
                wallet: wallet,
                contract: 'PlayMarket',
                data: data,
                gasLimit: gasLimit,
                gasPrice: gasPrice
            });
            let tx = await sendSignedTransaction(signedTransaction.rawTransaction);
            let transactionStatus = await getTransactionStatus(tx.transactionHash);
            let balance = await getBalance(address);
            await this.setState({
                balance: balance,
                registration: {
                    ...this.state.registration,
                    hash: tx.transactionHash
                }
            });
            if (transactionStatus) {
                await this.setState({
                    isRegistered: true
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
    handleSubmitRegistration_3 = async e => {
        e.preventDefault();
        this.props.history.push('/apps');
    };

    render(){
        let { popupOpen, hash, hashType, balance } = this.state;

        let { idCTG, subCategory, nameApp, slogan, shortDescr, keywords, youtubeID, email, ageRestrictions, price, publish, advertising, forChildren, urlApp, privacyPolicy, longDescr } = this.state.app;
        // let { packageName, version } = this.state.app;
        let { gallery, logo, banner, keyword, select } = this.state.SERVICE;

        let { gasPrice, address } = this.props;
        let { step, gasLimit, password } = this.state.registration;

        return (
            <div className="app-add">
                <Helmet>
                    <title>Add new application | Play Market 2.0 Developer Module</title>
                </Helmet>
                <div className="app-add__control">
                    <Link className="app-add__control__back" to="/apps">Applications</Link>
                </div>
                <form onSubmit={this.handleSubmitUpload}>
                    <section className="app-add__section-1">
                        <div className="app-add__section-1__block">
                            <div className="app-add__section-1__block--left">
                                <div className="app-add__section-1__box">
                                    <div className="app-add__section-1__box-title">Logo</div>
                                    <div className="app-add__section-1__logo">
                                        {logo ? (<img src={logo.imageBase64} alt="PREVIEW"/>) : null}
                                        <div className={"app-add__section-1__logo__placeholder " + (logo ? '' : 'visible')}>no image available</div>
                                        <input required type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeLogo}/>
                                    </div>
                                </div>
                                <div className="app-add__section-1__box">
                                    <div className="app-add__section-1__box-title">Price</div>
                                    <div className="app-add__section-1__price">
                                        <input required type="number" min="0" name='price' value={price} onChange={this.handleChangeText}/>
                                    </div>
                                </div>
                            </div>
                            <div className="app-add__section-1__block--right">
                                <div className="app-add__section-1__box">
                                    <div className="app-add__section-1__box-title">Main</div>
                                    <div className="app-add__section-1__nameApp">
                                        <div className="app-add__section-1__nameApp__title">Name</div>
                                        <input required placeholder="Play Market 2.0" type="text" name='nameApp' value={nameApp} onChange={this.handleChangeText}/>
                                    </div>
                                    <div className="app-add__section-1__type">
                                        <div className="app-add__section-1__type__title">Type</div>
                                        <div className="app-add__section-1__type__select-box">
                                            <input required type="text" value={idCTG} onChange={this.preventEvent}/>
                                            <Select options={select.categories} value={select.selectedOptionCategory} onChange={this.handleChangeCategory} placeholder="Select type"/>
                                        </div>
                                    </div>
                                    <div className="app-add__section-1__category">
                                        <div className="app-add__section-1__category__title">Category</div>
                                        <div className="app-add__section-1__category__select-box">
                                            <input required type="text" value={subCategory} onChange={this.preventEvent}/>
                                            <Select options={select.subCategories} value={select.selectedOptionSubCategory} onChange={this.handleChangeSubCategory} placeholder="Select category"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="app-add__section-1__block">
                            <div className="app-add__section-1__box">
                                <div className="app-add__section-1__box-title">Description</div>
                                <div className="app-add__section-1__slogan">
                                    <div className="app-add__section-1__slogan__title">Slogan</div>
                                    <TextareaAutosize placeholder="DAO PLAYMARKET 2.0 is a new era of mobile applications" minRows={1} name='slogan' value={slogan} onChange={this.handleChangeText}/>
                                </div>
                                <div className="app-add__section-1__shortDescr">
                                    <div className="app-add__section-1__shortDescr__title">Brief</div>
                                    <TextareaAutosize placeholder="DAO PlayMarket 2.0 is a decentralized Android App Store that accepts payments in cryptocurrency and is combined with an ICO platform for developers." minRows={1} name='shortDescr' value={shortDescr} onChange={this.handleChangeText}/>
                                </div>
                                <div className="app-add__section-1__longDescr">
                                    <div className="app-add__section-1__longDescr__title">Detail</div>
                                    <TextareaAutosize placeholder="DAO PlayMarket 2.0 is a decentralized Android app store, combined with an ICO developer platform, crypto exchange, that accepts payment in crypto currency. The main goals and objectives of DAO PlayMarket 2.0 are to create a sustainable economic model for developers, investors and users, and introduce a unified standard for tokenizing the mobile applications market. Holders of PMT automatically become members of the PlayMarket Fund. The primary purpose of the fund includes open management of the fund's resources in conjunction with other members of DAO PlayMarket 2.0. Developers of applications on DAO PlayMarket 2.0 can release independant tokens for their application. The PlayMarket Fund retains 5% of the tokens from each application hosted on the DAO PlayMarket 2.0 platform." minRows={1} name='longDescr' value={longDescr} onChange={this.handleChangeText}/>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="app-add__section-2">
                        <div className="app-add__section-2__title">Application file</div>
                        <div className="app-add__section-2__box">
                            {this.state.app.files.apk ? (
                                <div className="app-add__section-2__box__preview">
                                    <div className="app-add__section-2__box__preview__img"></div>
                                    <ul className="app-add__section-2__box__preview__info-list">
                                        <li className="app-add__section-2__box__preview__info-list__item">Name: <span>{this.state.app.files.apk.name}</span></li>
                                        <li className="app-add__section-2__box__preview__info-list__item">Size: <span>{filesize(this.state.app.files.apk.size)}</span></li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="app-add__section-2__box__preview__placeholder">Select APK file</div>
                            )}
                            <input required type="file" name="apk" accept=".apk" onChange={this.handleChangeAPK}/>
                        </div>
                    </section>
                    <section className="app-add__section-3">
                        <div className="app-add__section-3__block app-add__section-3__block--1">
                            <div className="app-add__section-3__title">Gallery</div>
                            <div className="app-add__section-3__box">
                                {
                                    gallery.length > 0 ? (
                                        <ul className="app-add__section-3__box__preview-list">
                                            {
                                                gallery.length ? (
                                                    gallery.map((file, index) => {
                                                        return (
                                                            <li className="app-add__section-3__box__preview-list__item" key={index} >
                                                                <div className="app-add__section-3__box__preview-list__item__remove" onClick={this.handleRemoveGalleryItem} data-index={index} title="Remove image">Delete</div>
                                                                <img src={file.imageBase64} title={file.name} alt="PREVIEW"/>
                                                            </li>
                                                        )
                                                    })
                                                ) : null
                                            }
                                        </ul>
                                    ) : null
                                }
                                {
                                    gallery.length < 5 ? (
                                        <div className="app-add__section-3__box__input">
                                            <div className="app-add__section-3__box__input-text"><span>+</span>Add image</div>
                                            <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeGallery}/>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                        <div className="app-add__section-3__block app-add__section-3__block--2">
                            <div className="app-add__section-3__title">Banner</div>
                            <div className="app-add__section-3__banner">
                                {banner ? (
                                    <img src={banner.imageBase64} alt="PREVIEW"/>
                                ) : (
                                    <div className="app-add__section-3__banner__placeholder">Select horizontal image</div>
                                )}
                                <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeBanner}/>
                            </div>
                        </div>
                    </section>
                    <section className="app-add__section-4">
                        <div className="app-add__section-4__typical-block-text">
                            <div className="app-add__section-4__typical-block-text--left">
                                <div className="app-add__section-4__typical-block-text__title">Contact information</div>
                                <ul className="app-add__section-4__typical-block-text__list">
                                    <li className="app-add__section-4__typical-block-text__list--item">
                                        <div className="app-add__section-4__typical-block-text__list--item__title">EMAIL</div>
                                        <div className="app-add__section-4__typical-block-text__list--item__input">
                                            <input placeholder="support@playmarket.io" type="email" name='email' value={email} onChange={this.handleChangeText}/>
                                        </div>
                                    </li>
                                    <li className="app-add__section-4__typical-block-text__list--item">
                                        <div className="app-add__section-4__typical-block-text__list--item__title">Application website URL</div>
                                        <div className="app-add__section-4__typical-block-text__list--item__input">
                                            <input placeholder="https://playmarket.io" type="text" name='urlApp' value={urlApp} onChange={this.handleChangeText}/>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="app-add__section-4__keywords-block">
                            <div className="app-add__section-4__keywords-block--left">
                                <div className="app-add__section-4__keywords-block__title">Keywords</div>
                                <ul className="app-add__section-4__keywords-block__list">
                                    {
                                        keywords.length ? (
                                            keywords.map((item, index) => {
                                                return (
                                                    <li className="app-add__section-4__keywords-block__list-item" key={index}>
                                                        <div className="app-add__section-4__keywords-block__list-item__value">{item}</div>
                                                        <div className="app-add__section-4__keywords-block__list-item__remove" onClick={this.handleRemoveKeyword(index)} title="Remove"></div>
                                                    </li>
                                                )
                                            })
                                        ): (
                                            <div className="app-add__section-4__keywords-block__list-placeholder">Keywords not specified</div>
                                        )
                                    }
                                </ul>
                                <div className="app-add__section-4__keywords-block__add">
                                    <input className="app-add__section-4__keywords-block__add-input" type="text" value={keyword} onChange={this.handleChangeKeyword}/>
                                    <div className="app-add__section-4__keywords-block__add-btn" onClick={this.handleAddKeyword}>add</div>
                                </div>
                            </div>
                        </div>
                        <div className="app-add__section-4__typical-block-text">
                            <div className="app-add__section-4__typical-block-text--left">
                                <div className="app-add__section-4__typical-block-text__title">Something else</div>
                                <ul className="app-add__section-4__typical-block-text__list">
                                    <li className="app-add__section-4__typical-block-text__list--item">
                                        <div className="app-add__section-4__typical-block-text__list--item__title">Privacy policy URL</div>
                                        <div className="app-add__section-4__typical-block-text__list--item__input">
                                            <input placeholder="https://playmarket.io/privacy-policy" type="text" name='privacyPolicy' value={privacyPolicy} onChange={this.handleChangeText}/>
                                        </div>
                                    </li>
                                    <li className="app-add__section-4__typical-block-text__list--item">
                                        <div className="app-add__section-4__typical-block-text__list--item__title">Age restrictions (minimum age)</div>
                                        <div className="app-add__section-4__typical-block-text__list--item__input">
                                            <input placeholder="18" type="number" min="0" name='ageRestrictions' value={ageRestrictions} onChange={this.handleChangeText}/>
                                        </div>
                                    </li>
                                    <li className="app-add__section-4__typical-block-text__list--item">
                                        <div className="app-add__section-4__typical-block-text__list--item__title">YouTube video ID</div>
                                        <div className="app-add__section-4__typical-block-text__list--item__input">
                                            <input placeholder="QYjyfCt6gWc" type="text" name='youtubeID' value={youtubeID} onChange={this.handleChangeText}/>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="app-add__section-4__typical-block">
                            <div className="app-add__section-4__typical-block--left">
                                <div className="app-add__section-4__typical-block__title">Publish after verification</div>
                                <div className="app-add__section-4__typical-block__description">
                                    You want that we publish your app immediately after moderation?<br/>
                                    If you choose "no" for publication in the future will require a separate transaction!
                                </div>
                            </div>
                            <div className="app-add__section-4__typical-block--right">
                                <div className="app-add__section-4__typical-block__checkbox">
                                    <input type="checkbox" name='publish' checked={publish} onChange={this.handleChangeCheckbox}/>
                                    <div className="app-add__section-4__typical-block__checkbox--zone" data-trigger={publish}>
                                        <div></div>
                                        <span className={!publish ? 'active' : null}>no</span>
                                        <span className={publish ? 'active' : null}>yes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="app-add__section-4__typical-block">
                            <div className="app-add__section-4__typical-block--left">
                                <div className="app-add__section-4__typical-block__title">For children</div>
                                <div className="app-add__section-4__typical-block__description">
                                    Your app is primarily intended for children under 13 years according to the definition of COPPA?
                                </div>
                            </div>
                            <div className="app-add__section-4__typical-block--right">
                                <div className="app-add__section-4__typical-block__checkbox">
                                    <input type="checkbox" name='forChildren' checked={forChildren} onChange={this.handleChangeCheckbox}/>
                                    <div className="app-add__section-4__typical-block__checkbox--zone" data-trigger={forChildren}>
                                        <div></div>
                                        <span className={!forChildren ? 'active' : null}>no</span>
                                        <span className={forChildren ? 'active' : null}>yes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="app-add__section-4__typical-block">
                            <div className="app-add__section-4__typical-block--left">
                                <div className="app-add__section-4__typical-block__title">Has advertising</div>
                                <div className="app-add__section-4__typical-block__description">
                                    Your app shows ads? Review our advertising policies to prevent typical disorders.<br/>
                                    If you answered Yes, the application will be marked in the Play Market 2.0 shortcut "Has advertising".
                                </div>
                            </div>
                            <div className="app-add__section-4__typical-block--right">
                                <div className="app-add__section-4__typical-block__checkbox">
                                    <input type="checkbox" name='advertising' checked={advertising} onChange={this.handleChangeCheckbox}/>
                                    <div className="app-add__section-4__typical-block__checkbox--zone" data-trigger={advertising}>
                                        <div></div>
                                        <span className={!advertising ? 'active' : null}>no</span>
                                        <span className={advertising ? 'active' : null}>yes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="app-add__load-block">
                        <button className="app-add__load-block__btn">Upload</button>
                    </div>


                    {/*<section>*/}
                    {/*<h3>Package name</h3>*/}
                    {/*<input required type="text" name='packageName' value={packageName} onChange={this.handleChangeText}/>*/}
                    {/*</section>*/}
                    {/*<section>*/}
                    {/*<h3>App version (integer)</h3>*/}
                    {/*<input required type="text" name='version' value={version} onChange={this.handleChangeText}/>*/}
                    {/*</section>*/}

                </form>
                <Popup className="app-add-popup" open={popupOpen} onClose={this.closeModal}>
                    <div>
                        {
                            this.state.isUpload ? (
                                <div>
                                    <div className="app-add-popup__main">
                                        <h3 className="app-add-popup__main__title">Account info</h3>
                                        <ul className="app-add-popup__main__list">
                                            <li className="app-add-popup__main__list-item">
                                                <div className="app-add-popup__main__list-item__title">Address:</div>
                                                <div className="app-add-popup__main__list-item__value">{address}</div>
                                            </li>
                                            <li className="app-add-popup__main__list-item">
                                                <div className="app-add-popup__main__list-item__title">Balance:</div>
                                                <div className="app-add-popup__main__list-item__value">{web3Utils.fromWei(balance, 'ether')} <span>ETH</span></div>
                                            </li>
                                        </ul>
                                    </div>
                                    {
                                        this.state.isRegistered ? (
                                            <form className="app-add-popup__registration" onSubmit={this.handleSubmitRegistration_3}>
                                                <h3 className="app-add-popup__registration__title">app registration</h3>
                                                <div className="app-add-popup__registration__subtitle">Your application is successfully registered!<br/>After moderation it will appear in your list of applications</div>
                                                <div className="app-add-popup__btn-block app-add-popup__btn-block--center">
                                                    <button className="app-add-popup__btn-block__btn">OK</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div>
                                                {
                                                    step === 1 ? (
                                                        <form className="app-add-popup__registration"
                                                              onSubmit={this.handleSubmitRegistration_1}>
                                                            <h3 className="app-add-popup__registration__title">app registration</h3>
                                                            <div className="app-add-popup__registration__subtitle">
                                                                Confirmation of the transaction data
                                                            </div>
                                                            <ul className="app-add-popup__registration__preview-list">
                                                                <li className="app-add-popup__registration__preview-list__item">
                                                                    <div
                                                                        className="app-add-popup__registration__preview-list__item--title">
                                                                        Hash:
                                                                    </div>
                                                                    <div
                                                                        className="app-add-popup__registration__preview-list__item--value">{hash}</div>
                                                                </li>
                                                                <li className="app-add-popup__registration__preview-list__item">
                                                                    <div
                                                                        className="app-add-popup__registration__preview-list__item--title">
                                                                        Hash type:
                                                                    </div>
                                                                    <div
                                                                        className="app-add-popup__registration__preview-list__item--value">{hashType}</div>
                                                                </li>
                                                            </ul>
                                                            <ul className="app-add-popup__registration__list">
                                                                <li className="app-add-popup__registration__list-item">
                                                                    <div
                                                                        className="app-add-popup__registration__list-item__title">
                                                                        Gas Limit:
                                                                    </div>
                                                                    <input
                                                                        className="app-add-popup__registration__list-item__input"
                                                                        required name="gasLimit" type="number"
                                                                        value={gasLimit}
                                                                        onChange={this.handleChangeTxParams}/>
                                                                </li>
                                                            </ul>
                                                            <ul className="app-add-popup__registration__fee-list">
                                                                <li className="app-add-popup__registration__fee-list__item">
                                                                    <div
                                                                        className="app-add-popup__registration__fee-list__item--title">
                                                                        Gas Price:
                                                                    </div>
                                                                    <div className="app-add-popup__registration__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')} Gwei</div>
                                                                </li>
                                                                <li className="app-add-popup__registration__fee-list__item">
                                                                    <div
                                                                        className="app-add-popup__registration__fee-list__item--title">
                                                                        Approximate fee:
                                                                    </div>
                                                                    <div
                                                                        className="app-add-popup__registration__fee-list__item--value">{web3Utils.fromWei((gasPrice * gasLimit).toString(), 'ether')}</div>
                                                                </li>
                                                            </ul>
                                                            <div className="app-add-popup__btn-block">
                                                                <button className="app-add-popup__btn-block__btn">
                                                                    Accept
                                                                </button>
                                                                <div className="app-add-popup__btn-block__btn--cancel" onClick={this.closeModal}>Cancel</div>
                                                            </div>
                                                        </form>
                                                    ) : null
                                                }
                                                {
                                                    step === 2 ? (
                                                        <form className="app-add-popup__registration" onSubmit={this.handleSubmitRegistration_2}>
                                                            <h3 className="app-add-popup__registration__title">app registration</h3>
                                                            <div className="app-add-popup__registration__subtitle">Sending transaction</div>
                                                            <ul className="app-add-popup__registration__list">
                                                                <li className="app-add-popup__registration__list-item">
                                                                    <div className="app-add-popup__registration__list-item__title">Keystore password:</div>
                                                                    <input className="app-add-popup__registration__list-item__input" required name="password" type="password" value={password} onChange={this.handleChangeTxParams}/>
                                                                </li>
                                                            </ul>
                                                            <div className="app-add-popup__btn-block">
                                                                <button className="app-add-popup__btn-block__btn">send tx</button>
                                                                <div className="app-add-popup__btn-block__btn--cancel" onClick={this.handleClickBackRegistration_1}>Back</div>
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
        )
    }
}

const mapStateToProps = (state) => {
    return {
        gasPrice: state.gasPrice,
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