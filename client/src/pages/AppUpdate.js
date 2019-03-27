import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";
import Popup from "reactjs-popup";
import TextareaAutosize from 'react-textarea-autosize';
import { Link } from 'react-router-dom'
import {utils as web3Utils} from 'web3';
import Select from 'react-select';
import $ from "jquery";
import filesize from 'filesize';
import path from 'path';

import { startLoading, endLoading } from '../actions/preloader';

import { sendTransaction_MM, getTxParams, getWallet, sendSignedTransaction, getBalance, getData, getGasLimit, getSignedTransaction } from '../utils/web3'

import Notification from '../components/Notification';

class AppUpdate extends Component {
    state = {
        SERVICE: {
            logo: null,
            keyword: '',
            gallery: [],
            banner: null,
            select: {
                categories: [],
                subCategories: [],
                selectedOptionCategory: null,
                selectedOptionSubCategory: null
            }
        },
        removed_gallery_files: [],
        changelog_text: '',
        new_files: {
            apk: null,
            gallery: [],
            logo: null,
            banner: null,
        },
        app: null,
        config: null,
        popupOpen: false,
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
        const { url, idApp, address, categories } = this.props;
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
                config: config.result
            });

            await this.formatterSelectCategories();
            const ctg = categories.find(item => item.id === parseInt(app.result.idCTG));
            await this.handleChangeCategory({
                value: parseInt(app.result.idCTG),
                label: ctg.name
            });
            const subctg = ctg.subcategories.find(item => item.id === parseInt(app.result.subCategory));
            await this.handleChangeSubCategory({
                value: parseInt(app.result.subCategory),
                label: subctg.name
            });

            await this.props.endLoading();
        } catch (err) {
            await this.props.endLoading();
            Notification('error', err.message);
        }
    }

    formatterSelectCategories = async () => {
        const { categories } = this.props;
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
        const { categories } = this.props;
        const { idCTG } = this.state.app;
        const subCategories = (categories.find(item => item.id === idCTG)).subcategories;
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

    preventEvent = e => {
        e.preventDefault();
    };

    handleChangeText = async e => {
        const name = e.target.getAttribute('name');
        await this.setState({app: {...this.state.app, [name]: e.target.value}});
    };
    handleChangeKeyword = async e => {
        const value = e.target.value;
        await this.setState({
            SERVICE: {...this.state.SERVICE, keyword: value}
        });
    };
    handleAddKeyword = async e => {
        const { keyword } = this.state.SERVICE;
        if (!!keyword.length) {
            await this.setState({
                app: {...this.state.app, keywords: [...this.state.app.keywords, keyword]},
                SERVICE: {...this.state.SERVICE, keyword: ''}
            });
        }
    };
    handleRemoveKeyword = index => async e => {
        e.preventDefault();
        const _keywords = this.state.app.keywords;
        _keywords.splice(index, 1);
        await this.setState({
            app: {...this.state.app, keywords: _keywords}
        });
    };
    handleChangeCheckbox = async e => {
        const name = e.target.getAttribute('name');
        await this.setState({app: {...this.state.app, [name]: e.target.checked}});
    };
    handleKeyPress = async e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await this.handleAddKeyword();
        }
    };
    handleChangeChangelog = async e => {
        await this.setState({changelog_text: e.target.value});
    };

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        await this.setState({ popupOpen: false });
    };

    handleChangeLogo = async e => {
        e.persist();
        const file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        new_files: {...this.state.new_files, logo: file},
                        SERVICE: {...this.state.SERVICE, logo: {imageBase64: reader.result, name: file.name}}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                $(e.target).val('');
                await this.setState({
                    new_files: {...this.state.new_files, logo: null},
                    SERVICE: {...this.state.SERVICE, logo: null}
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                new_files: {...this.state.new_files, logo: null},
                SERVICE: {...this.state.SERVICE, logo: null}
            });
        }
    };
    handleChangeBanner = async e => {
        e.persist();
        const file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        new_files: {...this.state.new_files, banner: file},
                        SERVICE: {...this.state.SERVICE, banner: {imageBase64: reader.result, name: file.name}}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                await this.setState({
                    new_files: {...this.state.new_files, banner: null},
                    SERVICE: {...this.state.SERVICE, banner: null}
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                new_files: {...this.state.new_files, banner: null},
                SERVICE: {...this.state.SERVICE, banner: null}
            });
        }
    };
    handleChangeAPK = async e => {
        const file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type === 'application/vnd.android.package-archive') {
                this.setState({
                    new_files: {...this.state.new_files, apk: file}
                });
            } else {
                $(e.target).val('');
                this.setState({
                    new_files: {...this.state.new_files, apk: null}
                });
                Notification('error', 'Invalid application file');
            }
        } else {
            this.setState({
                new_files: {...this.state.new_files, apk: null}
            });
        }
    };
    handleChangeGallery = async e => {
        e.persist();
        const file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        new_files: {...this.state.new_files, gallery: [...this.state.new_files.gallery, file]},
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
    handleRemoveGalleryItemOLD = file => async e => {
        e.preventDefault();
        const { gallery } = this.state.app.files.images;

        await this.setState({
            removed_gallery_files: [...this.state.removed_gallery_files, file],
            app: {
                ...this.state.app,
                files: {
                    ...this.state.app.files,
                    images: {
                        ...this.state.app.files.images,
                        gallery: gallery.filter(el => el !== file)
                    }
                }
            }
        });
    };
    handleRemoveGalleryItem = file => async e => {
        const { gallery } = this.state.SERVICE;

        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                gallery: gallery.filter(el => el.name !== file),
            },
            new_files: {
                ...this.state.new_files,
                gallery:  this.state.new_files.gallery.filter(el => el.name !== file)
            }
        });
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            const { address, contracts, idApp } = this.props;
            const { nameApp, idCTG, subCategory, slogan, shortDescr, keywords, youtubeID, email, ageRestrictions, advertising, forChildren, urlApp, privacyPolicy, longDescr } = this.state.app;
            const { logo, apk, banner, gallery } = this.state.new_files;
            const { removed_gallery_files, changelog_text } = this.state;

            let fd = new FormData();

            fd.append("nameApp", nameApp);
            fd.append("idCTG", idCTG);
            fd.append("subCategory", subCategory);
            fd.append("slogan", slogan);
            fd.append("shortDescr", shortDescr);

            fd.append("keywords", JSON.stringify(keywords));

            fd.append("youtubeID", youtubeID);
            fd.append("email", email);
            fd.append("ageRestrictions", ageRestrictions);
            fd.append("advertising", advertising);
            fd.append("forChildren", forChildren);
            fd.append("urlApp", urlApp);
            fd.append("privacyPolicy", privacyPolicy);
            fd.append("longDescr", longDescr);

            fd.append("apk", apk);
            fd.append("logo", logo, logo ? logo.name : null);
            fd.append("banner", banner, banner ? banner.name : null);
            for (let i = 0; i < gallery.length; i++) {
                fd.append("gallery", gallery[i], gallery[i].name);
            }

            fd.append("removed_gallery_files", JSON.stringify(removed_gallery_files));
            fd.append("changelog_text", changelog_text);

            const response = (await axios({
                method: 'post',
                url: '/api/update',
                headers: {'address': address},
                data: fd
            })).data;
            if (response.status === 200) {
                try {
                    const data = await getData({
                        contract: contracts.PlayMarket,
                        method: 'changeHashApp',
                        params: [idApp, response.result.hash, response.result.hashType]
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
                    console.error(err);
                    Notification('error', err.message);
                }
            } else {
                Notification('error', response.message);
            }
        } catch (err) {
            console.error(err);
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
        const { app, config, popupOpen, isUpload, balance, hashType, hash, changelog_text } = this.state;
        const { keyword, select, logo, banner, gallery } = this.state.SERVICE;
        const { step, gasLimit, success, password } = this.state._;
        const { gasPrice, mode, address } = this.props;
        const { apk } = this.state.new_files;

        return (
            <div>
                {
                    app && config ? (
                        <div className="app-add">
                            <Helmet>
                                <title>Update application | Play Market 2.0 Developer Module</title>
                            </Helmet>
                            <div className="app-add__control">
                                <Link className="app-add__control__back" to="/apps">Applications</Link>
                            </div>
                            <div className="app-add__title">Update application</div>
                            <form onSubmit={this.handleSubmitUpload}>
                                <section className="app-add__section-1">
                                    <div className="app-add__section-1__block">
                                        <div className="app-add__section-1__block--left">
                                            <div className="app-add__section-1__box">
                                                <div className="app-add__section-1__box-title">Logo</div>
                                                <div className="app-add__section-1__logo">
                                                    {
                                                        logo ? (
                                                            <img src={logo.imageBase64} alt="PREVIEW"/>
                                                        ) : <img src={'/data/tmp/app/' + address + '/' + app.files.images.logo} alt="PREVIEW"/>
                                                    }
                                                    <div className={"app-add__section-1__logo__placeholder " + (app.files.images.logo ? '' : 'visible')}>no image available</div>
                                                    <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeLogo}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="app-add__section-1__block--right">
                                            <div className="app-add__section-1__box">
                                                <div className="app-add__section-1__box-title">Main</div>
                                                <div className="app-add__section-1__nameApp">
                                                    <div className="app-add__section-1__nameApp__title">Name</div>
                                                    <input required placeholder="Play Market 2.0" type="text" name='nameApp'
                                                           value={app.nameApp} onChange={this.handleChangeText}/>
                                                </div>
                                                <div className="app-add__section-1__type">
                                                    <div className="app-add__section-1__type__title">Type</div>
                                                    <div className="app-add__section-1__type__select-box">
                                                        <input required type="text" value={app.idCTG} onChange={this.preventEvent}/>
                                                        <Select options={select.categories} value={select.selectedOptionCategory} onChange={this.handleChangeCategory} placeholder="Select type"/>
                                                    </div>
                                                </div>
                                                <div className="app-add__section-1__category">
                                                    <div className="app-add__section-1__category__title">Category</div>
                                                    <div className="app-add__section-1__category__select-box">
                                                        <input required type="text" value={app.subCategory} onChange={this.preventEvent}/>
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
                                                <TextareaAutosize
                                                    placeholder="DAO PLAYMARKET 2.0 is a new era of mobile applications"
                                                    minRows={1} name='slogan' value={app.slogan} onChange={this.handleChangeText}/>
                                            </div>
                                            <div className="app-add__section-1__shortDescr">
                                                <div className="app-add__section-1__shortDescr__title">Brief</div>
                                                <TextareaAutosize
                                                    placeholder="DAO PlayMarket 2.0 is a decentralized Android App Store that accepts payments in cryptocurrency and is combined with an ICO platform for developers."
                                                    minRows={1} name='shortDescr' value={app.shortDescr}
                                                    onChange={this.handleChangeText}/>
                                            </div>
                                            <div className="app-add__section-1__longDescr">
                                                <div className="app-add__section-1__longDescr__title">Detail</div>
                                                <TextareaAutosize
                                                    placeholder="DAO PlayMarket 2.0 is a decentralized Android app store, combined with an ICO developer platform, crypto exchange, that accepts payment in crypto currency. The main goals and objectives of DAO PlayMarket 2.0 are to create a sustainable economic model for developers, investors and users, and introduce a unified standard for tokenizing the mobile applications market. Holders of PMT automatically become members of the PlayMarket Fund. The primary purpose of the fund includes open management of the fund's resources in conjunction with other members of DAO PlayMarket 2.0. Developers of applications on DAO PlayMarket 2.0 can release independant tokens for their application. The PlayMarket Fund retains 5% of the tokens from each application hosted on the DAO PlayMarket 2.0 platform."
                                                    minRows={1} name='longDescr' value={app.longDescr}
                                                    onChange={this.handleChangeText}/>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section className="app-add__section-2">
                                    <div className="app-add__section-2__title">Application file</div>
                                    <div className="app-add__section-2__box">
                                        {
                                            apk ? (
                                                <div className="app-add__section-2__box__preview">
                                                    <div className="app-add__section-2__box__preview__img"></div>
                                                    <ul className="app-add__section-2__box__preview__info-list">
                                                        <li className="app-add__section-2__box__preview__info-list__item">Name: <span>{apk.name}</span></li>
                                                        <li className="app-add__section-2__box__preview__info-list__item">Size: <span>{filesize(apk.size)}</span></li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="app-add__section-2__box__preview">
                                                    <div className="app-add__section-2__box__preview__img"></div>
                                                    <ul className="app-add__section-2__box__preview__info-list">
                                                        <li className="app-add__section-2__box__preview__info-list__item">Name: <span>{path.basename(app.files.apk)}</span></li>
                                                        {
                                                            typeof app.size !== 'undefined' ? (
                                                                <li className="app-add__section-2__box__preview__info-list__item">Size: <span>{filesize(app.size)}</span></li>
                                                            ) : null
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                        <input type="file" name="apk" accept=".apk" onChange={this.handleChangeAPK}/>
                                    </div>
                                    {
                                        apk ? (
                                            <section className="update__section-apk">
                                                <div className="update__section-apk__text">
                                                    <div className="update__section-apk__text__title">Description of changes</div>
                                                    <TextareaAutosize placeholder="New features, more stable" minRows={1} value={changelog_text} onChange={this.handleChangeChangelog}/>
                                                </div>
                                            </section>
                                        ) : null
                                    }
                                </section>
                                <section className="app-add__section-3">
                                    <div className="app-add__section-3__block app-add__section-3__block--1">
                                        <div className="app-add__section-3__title">Gallery</div>
                                        <div className="app-add__section-3__box">
                                            {
                                                app.files.images.gallery.length + gallery.length > 0 ? (
                                                    <ul className="app-add__section-3__box__preview-list">
                                                        {
                                                            app.files.images.gallery.length ? (
                                                                app.files.images.gallery.map((file, index) => {
                                                                    return (
                                                                        <li className="app-add__section-3__box__preview-list__item" key={index} >
                                                                            <div className="app-add__section-3__box__preview-list__item__remove" onClick={this.handleRemoveGalleryItemOLD(file)} title="Remove image">Delete</div>
                                                                            <img src={'/data/tmp/app/' + address + '/' + file} title={path.basename(file)} alt="PREVIEW"/>
                                                                        </li>
                                                                    )
                                                                })
                                                            ) : null
                                                        }
                                                        {
                                                            gallery.length ? (
                                                                gallery.map((file, index) => {
                                                                    return (
                                                                        <li className="app-add__section-3__box__preview-list__item" key={index} >
                                                                            <div className="app-add__section-3__box__preview-list__item__remove" onClick={this.handleRemoveGalleryItem(file.name)} title="Remove image">Delete</div>
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
                                                app.files.images.gallery.length + gallery.length < 5 ? (
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
                                            {
                                                banner ? (
                                                    <img src={banner.imageBase64} alt="PREVIEW"/>
                                                ) : (
                                                    app.files.images.banner ?
                                                        (
                                                            <img src={'/data/tmp/app/' + address + '/' + app.files.images.banner} alt="PREVIEW"/>
                                                        ) : <div className="app-add__section-3__banner__placeholder">Select horizontal image</div>
                                                )
                                            }
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
                                                        <input placeholder="support@playmarket.io" type="email" name='email' value={app.email} onChange={this.handleChangeText}/>
                                                    </div>
                                                </li>
                                                <li className="app-add__section-4__typical-block-text__list--item">
                                                    <div className="app-add__section-4__typical-block-text__list--item__title">Application website URL</div>
                                                    <div className="app-add__section-4__typical-block-text__list--item__input">
                                                        <input placeholder="https://playmarket.io" type="text" name='urlApp' value={app.urlApp} onChange={this.handleChangeText}/>
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
                                                    app.keywords.length ? (
                                                        app.keywords.map((item, index) => {
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
                                                <input className="app-add__section-4__keywords-block__add-input" type="text" value={keyword} onChange={this.handleChangeKeyword} onKeyPress={this.handleKeyPress}/>
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
                                                        <input placeholder="https://playmarket.io/privacy-policy" type="text" name='privacyPolicy' value={app.privacyPolicy} onChange={this.handleChangeText}/>
                                                    </div>
                                                </li>
                                                <li className="app-add__section-4__typical-block-text__list--item">
                                                    <div className="app-add__section-4__typical-block-text__list--item__title">Age restrictions (minimum age)</div>
                                                    <div className="app-add__section-4__typical-block-text__list--item__input">
                                                        <input placeholder="18" type="number" min="0" name='ageRestrictions' value={app.ageRestrictions} onChange={this.handleChangeText}/>
                                                    </div>
                                                </li>
                                                <li className="app-add__section-4__typical-block-text__list--item">
                                                    <div className="app-add__section-4__typical-block-text__list--item__title">YouTube video ID</div>
                                                    <div className="app-add__section-4__typical-block-text__list--item__input">
                                                        <input placeholder="QYjyfCt6gWc" type="text" name='youtubeID' value={app.youtubeID} onChange={this.handleChangeText}/>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="app-add__section-4__typical-block">
                                        <div className="app-add__section-4__typical-block--left">
                                            <div className="app-add__section-4__typical-block__title">For children</div>
                                            <div className="app-add__section-4__typical-block__description">
                                                Your app is primarily intended for children under 13 years according to the definition of <a href="http://www.coppa.org/" target="_blank" rel="noopener noreferrer">COPPA</a>?
                                            </div>
                                        </div>
                                        <div className="app-add__section-4__typical-block--right">
                                            <div className="app-add__section-4__typical-block__checkbox">
                                                <input type="checkbox" name='forChildren' checked={app.forChildren} onChange={this.handleChangeCheckbox}/>
                                                <div className="app-add__section-4__typical-block__checkbox--zone" data-trigger={app.forChildren}>
                                                    <div></div>
                                                    <span className={!app.forChildren ? 'active' : null}>no</span>
                                                    <span className={app.forChildren ? 'active' : null}>yes</span>
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
                                                <input type="checkbox" name='advertising' checked={app.advertising} onChange={this.handleChangeCheckbox}/>
                                                <div className="app-add__section-4__typical-block__checkbox--zone" data-trigger={app.advertising}>
                                                    <div></div>
                                                    <span className={!app.advertising ? 'active' : null}>no</span>
                                                    <span className={app.advertising ? 'active' : null}>yes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <div className="app-add__load-block">
                                    <button className="app-add__load-block__btn">Upload</button>
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
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        idApp: ownProps.match.params.app_id,
        categories: state.categories,
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