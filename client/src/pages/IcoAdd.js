import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import filesize from 'filesize';
import fileExtension from 'file-extension';
import axios from 'axios';
import {Helmet} from "react-helmet";
import {utils as web3Utils} from 'web3';
import $ from "jquery";
import Popup from "reactjs-popup";
import moment from 'moment';
import TextareaAutosize from 'react-textarea-autosize';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css';

import { startLoading, endLoading } from '../actions/preloader';

import Notification from '../components/Notification';

import { sendTransaction_MM, getTxParams, getWallet, sendSignedTransaction, getBalance, getData, getGasLimit, getSignedTransaction } from '../utils/web3'

class IcoAdd extends Component {
    state = {
        popupOpen: false,
        isUpload: false,
        hash: '',
        hashType: '',
        app: null,
        _: {
            info: {
                step: 1,
                data: '',
                gasLimit: '',
                hashTx: '',
                password: '',
                success: false
            },
            contract: {
                step: 1,
                data: '',
                gasLimit: '',
                hashTx: '',
                password: '',
                success: false
            }
        },
        SERVICE: {
            description: [],
            advantages: [],
            gallery: [],
            logo: null,
            banner: null,
            keyword: '',
            minDate: moment().startOf('day'),
            // minDate: moment().add(3, 'day').startOf('day'),
            members: {
                temp : {
                    team: {
                        name: '',
                        photo: null,
                        photoPreview: null,
                        description: '',
                        social: {
                            googlePlus: '',
                            facebook: '',
                            linkedin: '',
                            instagram: '',
                            vk: '',
                            youtube: '',
                            telegram: '',
                            gitHub: '',
                            twitter: ''
                        }
                    },
                    advisors: {
                        name: '',
                        photo: null,
                        photoPreview: null,
                        description: '',
                        social: {
                            googlePlus: '',
                            facebook: '',
                            linkedin: '',
                            instagram: '',
                            vk: '',
                            youtube: '',
                            telegram: '',
                            gitHub: '',
                            twitter: ''
                        }
                    }
                },
                team: [],
                advisors: [],
            }
        },
        settings: {
            tokenName: '',
            tokenSymbol: '',
            startDate: moment().startOf('hour'),
            // startDate: moment().add(3, 'day').startOf('day'),
            hardCapUSD: '',
            multisigWallet: '',
            CSID: 1,
            ATID: 1,
            periods: 3
        },
        ico: {
            keywords: [],
            youtubeID: '',
            email: '',
            urlICO: '',
            privacyPolicy: '',
            description: {
                images: [],
                text: ''
            },
            advantages: {
                images: [],
                text: ''
            },
            social: {
                googlePlus: '',
                facebook: '',
                linkedin: '',
                instagram: '',
                vk: '',
                youtube: '',
                telegram: '',
                gitHub: '',
                twitter: ''
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
        let idApp = this.props.id;
        let { url } = this.props;
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
            // let info = await contractMethod({
            //     contract: contracts.ICOList,
            //     name: 'ICOs',
            //     params: [1, address, 1]
            // });
            //
            // if (!!info.hash && !!info.hashType) {
            //     await this.setState({
            //         popupOpen: false,
            //         _: {
            //             ...this.state._,
            //             info: {
            //                 ...this.state._.info,
            //                 success: true
            //             }
            //         }
            //     });
            // }
            await this.props.endLoading();
        } catch (err) {
            await this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
    }

    openModal = async () => {
        await this.setState({ popupOpen: true });
    };
    closeModal = async () => {
        await this.setState({ popupOpen: false });
    };

    handleChangeTokenName = async e => {
        e.preventDefault();
        await this.setState({settings: {...this.state.settings, tokenName: e.target.value}});
    };
    handleChangeTokenSymbol = async e => {
        e.preventDefault();
        await this.setState({settings: {...this.state.settings, tokenSymbol: e.target.value}});
    };
    handleChangeHardCapUSD = async e => {
        e.preventDefault();
        await this.setState({settings: {...this.state.settings, hardCapUSD: e.target.value}});
    };
    handleChangeStartDate = async date => {
        await this.setState({
            settings: {
                ...this.state.settings,
                startDate: date
            }
        });
    };
    handleChangemMltisigWallet = async e => {
        await this.setState({
            settings: {
                ...this.state.settings,
                multisigWallet: e.target.value
            }
        });
    };
    handleChangeATID = async e => {
        const ATID = parseInt(e.target.value, 10);

        let CSID;
        if (ATID === 1 || ATID === 2) {
            CSID = 1
        }
        if (ATID === 3) {
            CSID = 2
        }

        let periods;
        if (CSID === 1) {
            periods = 3
        }
        if (CSID === 2) {
            periods = 8
        }

        await this.setState({
            settings: {
                ...this.state.settings,
                ATID: ATID,
                CSID: CSID,
                periods: periods
            }
        });
    };

    handleChangeMemberPhoto = param => async e => {
        e.preventDefault();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        SERVICE: {
                            ...this.state.SERVICE,
                            members: {
                                ...this.state.SERVICE.members,
                                temp: {
                                    ...this.state.SERVICE.members.temp,
                                    [param]: {
                                        ...this.state.SERVICE.members.temp[param],
                                        photo: file,
                                        photoPreview: {
                                            imageBase64: reader.result,
                                            name: file.name
                                        }
                                    }
                                }
                            }
                        }
                    });
                };
                reader.readAsDataURL(file);
            } else {
                $(e.target).val('');
                await this.setState({
                    SERVICE: {
                        ...this.state.SERVICE,
                        members: {
                            ...this.state.SERVICE.members,
                            temp: {
                                ...this.state.SERVICE.members.temp,
                                [param]: {
                                    ...this.state.SERVICE.members.temp[param],
                                    photo: null,
                                    photoPreview: null
                                }
                            }
                        }
                    }
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                SERVICE: {
                    ...this.state.SERVICE,
                    members: {
                        ...this.state.SERVICE.members,
                        temp: {
                            ...this.state.SERVICE.members.temp,
                            [param]: {
                                ...this.state.SERVICE.members.temp[param],
                                photo: null,
                                photoPreview: null
                            }
                        }
                    }
                }
            });
        }
    };
    handleChangeMemberName = param => async e => {
        e.preventDefault();
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                members: {
                    ...this.state.SERVICE.members,
                    temp: {
                        ...this.state.SERVICE.members.temp,
                        [param]: {
                            ...this.state.SERVICE.members.temp[param],
                            name: e.target.value
                        }
                    }
                }
            }
        });
    };
    handleChangeMemberDescription = param => async e => {
        e.preventDefault();
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                members: {
                    ...this.state.SERVICE.members,
                    temp: {
                        ...this.state.SERVICE.members.temp,
                        [param]: {
                            ...this.state.SERVICE.members.temp[param],
                            description: e.target.value
                        }
                    }
                }
            }
        });
    };
    handleChangeMemberSocial = param => async e => {
        let name = e.target.getAttribute('name');
        e.preventDefault();
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                members: {
                    ...this.state.SERVICE.members,
                    temp: {
                        ...this.state.SERVICE.members.temp,
                        [param]: {
                            ...this.state.SERVICE.members.temp[param],
                            social: {
                                ...this.state.SERVICE.members.temp[param].social,
                                [name]: e.target.value
                            }
                        }
                    }
                }
            }
        });
    };
    handleSubmitAddMember = param => async e => {
        e.preventDefault();
        let {members} = this.state.SERVICE;
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                members: {
                    ...this.state.SERVICE.members,
                    [param]: [
                        ...this.state.SERVICE.members[param],
                        {
                            imageBase64: members.temp[param].photoPreview ? members.temp[param].photoPreview.imageBase64 : null,
                            imageName: members.temp[param].photoPreview ? members.temp[param].photoPreview.name : null
                        }
                    ],
                    temp: {
                        ...this.state.SERVICE.members.temp,
                        [param]: {
                            name: '',
                            photo: null,
                            photoPreview: null,
                            description: '',
                            social: {
                                googlePlus: '',
                                facebook: '',
                                linkedin: '',
                                instagram: '',
                                vk: '',
                                youtube: '',
                                telegram: '',
                                gitHub: '',
                                twitter: ''
                            }
                        }
                    }
                }
            },
            ico: {
                ...this.state.ico,
                members: {
                    ...this.state.ico.members,
                    [param]: [
                        ...this.state.ico.members[param],
                        {
                            name: members.temp[param].name,
                            photo: members.temp[param].photo,
                            description: members.temp[param].description,
                            social: members.temp[param].social
                        }
                    ]
                }
            }
        });
        $('#' + [param] + '_logo').val('');
    };
    handleClickRemoveMember = (param, index) => async e => {
        e.preventDefault();
        let SERVICE_membersArr = this.state.SERVICE.members[param];
        let ico_membersArr = this.state.ico.members[param];
        SERVICE_membersArr.splice(index, 1);
        ico_membersArr.splice(index, 1);
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                members: {
                    ...this.state.SERVICE.members,
                    [param]: SERVICE_membersArr
                }
            },
            ico: {
                ...this.state.ico,
                members: {
                    ...this.state.ico.members,
                    [param]: ico_membersArr
                }
            }
        });
    };

    handleChangeLogo = async e => {
        e.persist();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        ico: {...this.state.ico, files: {...this.state.ico.files, logo: file}},
                        SERVICE: {...this.state.SERVICE, logo: {imageBase64: reader.result, name: file.name}}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                $(e.target).val('');
                await this.setState({
                    ico: {...this.state.ico, files: {...this.state.ico.files, logo: null}},
                    SERVICE: {...this.state.SERVICE, logo: null}
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                ico: {...this.state.ico, files: {...this.state.ico.files, logo: null}},
                SERVICE: {...this.state.SERVICE, logo: null}
            });
        }
    };
    handleChangeBanner = async e => {
        e.persist();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        ico: {...this.state.ico, files: {...this.state.ico.files, banner: file}},
                        SERVICE: {...this.state.SERVICE, banner: {imageBase64: reader.result, name: file.name}}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                $(e.target).val('');
                await this.setState({
                    ico: {...this.state.ico, files: {...this.state.ico.files, banner: null}},
                    SERVICE: {...this.state.SERVICE, banner: null}
                });
                Notification('error', 'Invalid image file');
            }
        } else {
            await this.setState({
                ico: {...this.state.ico, files: {...this.state.ico.files, banner: null}},
                SERVICE: {...this.state.SERVICE, banner: null}
            });
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
                        ico: {...this.state.ico, files: {...this.state.ico.files, gallery: [...this.state.ico.files.gallery, file]}},
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

        let gallerySERVICE = this.state.ico.files.gallery;
        gallerySERVICE.splice(index, 1);
        let galleryIco = this.state.SERVICE.gallery;
        galleryIco.splice(index, 1);

        await this.setState({
            ico: {...this.state.ico, files: {...this.state.ico.files, gallery: gallerySERVICE}},
            SERVICE: {...this.state.SERVICE, gallery: galleryIco}
        });
    };

    handleChangeDescriptionText = param => async e => {
        e.preventDefault();
        await this.setState({
            ico: {
                ...this.state.ico,
                [param]: {
                    ...this.state.ico[param],
                    text: e.target.value
                }
            }
        });
    };
    handleChangeDescriptionImage = param => async e => {
        e.persist();
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type.includes('image')) {
                let reader = new FileReader();
                reader.onload = async () => {
                    await this.setState({
                        ico: {...this.state.ico, [param]: {...this.state.ico[param], images: [...this.state.ico[param].images, file]}},
                        SERVICE: {...this.state.SERVICE, [param]: [...this.state.SERVICE[param], {imageBase64: reader.result, name: file.name}]}
                    });
                };
                reader.readAsDataURL(file);
            } else {
                Notification('error', 'Invalid image file');
            }
        }
        $(e.target).val('');
    };
    handleRemoveDescriptionImage = (param, index) => async e => {
        e.preventDefault();
        let SERVICE_arr = this.state.SERVICE[param];
        let ico_arr = this.state.ico[param].images;
        SERVICE_arr.splice(index, 1);
        ico_arr.splice(index, 1);
        await this.setState({
            SERVICE: {
                ...this.state.SERVICE,
                [param]: SERVICE_arr
            },
            ico: {
                ...this.state.ico,
                [param]: {
                    ...this.state.ico[param],
                    images: ico_arr
                }
            }
        });
    };

    handleChangeDocument = param => async e => {
        let file = e.target.files.length ? e.target.files[0] : null;
        if (file) {
            if (file.type === 'application/pdf') {
                this.setState({ico: {...this.state.ico, files: {...this.state.ico.files, [param]: file}}});
            } else {
                $(e.target).val('');
                this.setState({ico: {...this.state.ico, files: {...this.state.ico.files, [param]: null}}});
                Notification('error', 'Invalid application file');
            }
        } else {
            this.setState({ico: {...this.state.ico, files: {...this.state.ico.files, [param]: null}}});
        }
    };

    handleChangeSocial = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({
            ico: {
                ...this.state.ico,
                social: {
                    ...this.state.ico.social,
                    [name]: e.target.value
                }
            }
        });
    };

    handleChangeKeyword = async e => {
        await this.setState({
            SERVICE: {...this.state.SERVICE, keyword: e.target.value}
        });
    };
    handleAddKeyword = async e => {
        e.preventDefault();
        let { keyword } = this.state.SERVICE;
        if (!!keyword.length) {
            await this.setState({
                ico: {...this.state.ico, keywords: [...this.state.ico.keywords, keyword]},
                SERVICE: {...this.state.SERVICE, keyword: ''}
            });
        }
    };
    handleRemoveKeyword = index => async e => {
        e.preventDefault();
        let _keywords = this.state.ico.keywords;
        _keywords.splice(index, 1);
        await this.setState({
            ico: {...this.state.ico, keywords: _keywords}
        });
    };

    handleChangeTxParams = (source, param) => async e => {
        await this.setState({registration: {
            ...this.state._,
            [source]: {
                ...this.state._[source],
                [param]: e.target.value
            }
        }});
    };

    handleChangeText = async e => {
        let name = e.target.getAttribute('name');
        await this.setState({ico: {...this.state.ico, [name]: e.target.value}});
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            let { address } = this.props;
            let { keywords, youtubeID, email, urlICO, privacyPolicy, description, advantages, social } = this.state.ico;
            let { logo, gallery, banner, whitepaper, onepage } = this.state.ico.files;
            let { team, advisors } = this.state.ico.members;

            let fd = new FormData();

            fd.append("youtubeID", youtubeID);
            fd.append("email", email);
            fd.append("urlICO", urlICO);
            fd.append("privacyPolicy", privacyPolicy);
            fd.append("description", description.text);
            fd.append("advantages", advantages.text);

            fd.append("social", JSON.stringify(social));
            fd.append("keywords", JSON.stringify(keywords));

            fd.append("whitepaper", whitepaper, whitepaper ? ('whitepaper.' + fileExtension(whitepaper.name)) : null);
            fd.append("onepage", onepage, onepage ? ('onepage.' + fileExtension(onepage.name)) : null);
            fd.append("logo", logo, logo ? ('logo.' + fileExtension(logo.name)) : null);
            fd.append("banner", banner, banner ? ('banner.' + fileExtension(banner.name)) : null);

            for (let i = 0; i < gallery.length; i++) {
                fd.append("gallery", gallery[i], [i] + '.' + fileExtension(gallery[i].name));
            }
            for (let i = 0; i < description.images.length; i++) {
                fd.append("description", description.images[i], [i] + '.' + fileExtension(description.images[i].name));
            }
            for (let i = 0; i < advantages.images.length; i++) {
                fd.append("advantages", advantages.images[i], [i] + '.' + fileExtension(advantages.images[i].name));
            }

            for (let i = 0; i < team.length; i++) {
                let item = {...team[i]};
                let photoFile = item.photo;
                if (photoFile) {
                    let imageName = [i] + '.' + fileExtension(photoFile.name);
                    item.photo = imageName;
                    fd.append("team", photoFile, imageName);
                }
                fd.append("team", JSON.stringify(item));
            }

            for (let i = 0; i < advisors.length; i++) {
                let item = {...advisors[i]};
                let photoFile = item.photo;
                if (photoFile) {
                    let imageName = [i] + '.' + fileExtension(photoFile.name);
                    item.photo = imageName;
                    fd.append("advisors", photoFile, imageName);
                }
                fd.append("advisors", JSON.stringify(item));
            }

            let response = (await axios({
                method: 'post',
                url: '/api/ico-add',
                headers: {'address': address},
                data: fd
            })).data;
            if (response.status === 200) {
                try {
                    let { startDate, hardCapUSD, tokenName, tokenSymbol, periods } = this.state.settings;
                    let { contracts } = this.props;
                    let { app } = this.state;

                    let data = await getData({
                        contract: contracts.ICO,
                        method: 'addAppICOInfo',
                        params: [parseInt(app.idApp, 10), tokenName, tokenSymbol, startDate.unix(), parseInt(periods, 10), 2592000, parseInt(hardCapUSD * 1000000, 10), response.result.hash, parseInt(response.result.hashType, 10)]
                    });
                    let gasLimit = await getGasLimit({
                        from: address,
                        contract: contracts.ICO,
                        data: data,
                        reserve: 0
                    });
                    let balance = await getBalance(address);
                    await this.setState({
                        _: {
                            ...this.state._,
                            info: {
                                ...this.state._.info,
                                step: 1,
                                data: data,
                                gasLimit: gasLimit
                            }
                        },
                        balance: balance,
                        isUpload: true,
                        hashType: response.result.hashType,
                        hash: response.result.hash
                    });
                    await this.openModal();
                } catch (err) {
                    this.props.endLoading();
                    console.error(err);
                    Notification('error', err.message);
                }
            } else {
                Notification('error', response.result);
            }

            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
        this.props.endLoading();
    };
    handleSubmitCreate = async e => {
        e.preventDefault();
        this.props.startLoading();
        try {
            let { multisigWallet, CSID, ATID } = this.state.settings;
            let { address, contracts } = this.props;
            let { app } = this.state;

            let data = await getData({
                contract: contracts.ICO,
                method: 'addAppICO',
                params: [parseInt(app.idApp, 10), multisigWallet, CSID, ATID]
            });
            let gasLimit = await getGasLimit({
                from: address,
                contract: contracts.ICO,
                data: data,
                reserve: 0
            });
            await this.setState({
                _: {
                    ...this.state._,
                    contract: {
                        ...this.state._.contract,
                        step: 1,
                        data: data,
                        gasLimit: gasLimit
                    }
                }
            });
            await this.openModal();
        } catch (err) {
            console.error(err);
            Notification('error', err.message);
        }
        this.props.endLoading();
    };

    handleClickBackToAddInfo = async () => {
        await this.setState({
            popupOpen: false,
            _: {
                ...this.state._,
                info: {
                    ...this.state._.info,
                    success: false
                }
            }
        });
    };
    handleClickBackPopup = (source, step) => async () => {
        await this.setState({
            _: {
                ...this.state._,
                [source] : {
                    ...this.state._[source],
                    step: step
                }
            }
        });
    };

    handleSubmitRegistration_1 = async e => {
        e.preventDefault();
        await this.setState({
            _: {
                ...this.state._,
                info: {
                    ...this.state._.info,
                    step: 2,
                    password: ''
                }
            }
        });
    };
    handleSubmitRegistration_2 = async e => {
        e.preventDefault();
        let { gasPrice, address, mode, contracts } = this.props;
        let { data, gasLimit } = this.state._.info;
        this.props.startLoading();
        let tx;
        switch (mode) {
            case 'keystore':
                let { keystore } = this.props;
                let { password } = this.state._.info;
                try {
                    const wallet = await getWallet(keystore, password);
                    const signedTransaction = await getSignedTransaction({
                        wallet: wallet,
                        contract: contracts.ICO,
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
                        contract: contracts.ICO,
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
                    info: {
                        ...this.state._.info,
                        hashTx: tx.transactionHash
                    }
                }
            });
            await this.setState({
                popupOpen: false,
                _: {
                    ...this.state._,
                    info: {
                        ...this.state._.info,
                        success: true
                    }
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
        await this.setState({
            _: {
                ...this.state._,
                contract: {
                    ...this.state._.contract,
                    step: 2,
                    password: ''
                }
            }
        });
    };
    handleSubmitRegistration_4 = async e => {
        e.preventDefault();
        const { gasPrice, address, mode, contracts } = this.props;
        const { data, gasLimit } = this.state._.contract;
        this.props.startLoading();
        let tx;
        switch (mode) {
            case 'keystore':
                let { keystore } = this.props;
                let { password } = this.state._.contract;
                try {
                    let wallet = await getWallet(keystore, password);
                    let signedTransaction = await getSignedTransaction({
                        wallet: wallet,
                        contract: contracts.ICO,
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
                    let txParams = await getTxParams({
                        contract: contracts.ICO,
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
                break;
        }
        try {
            const balance = await getBalance(address);
            await this.setState({
                balance: balance,
                _: {
                    ...this.state._,
                    contract: {
                        ...this.state._.contract,
                        hashTx: tx.transactionHash
                    }
                }
            });
            await this.setState({
                _: {
                    ...this.state._,
                    contract: {
                        ...this.state._.contract,
                        success: true
                    }
                }
            });
        } catch (err) {
            console.error(err);
            Notification('error', err.message);
        }
        this.props.endLoading();
    };
    handleSubmitRegistration_5 = async e => {
        e.preventDefault();
        this.props.history.push('/apps');
    };

    render(){
        let { popupOpen, hash, hashType, balance, app, ico, urlICO, email } = this.state;
        let { gasPrice, address, mode } = this.props;

        let { minDate, members, logo, banner, gallery, description, advantages, keyword } = this.state.SERVICE;
        let { tokenName, tokenSymbol, startDate, hardCapUSD, multisigWallet, ATID, CSID, periods } = this.state.settings;
        let { info, contract } = this.state._;

        return (
            <div>
                {
                    app ? (
                        <div className="ico-add">
                            <Helmet>
                                <title>Start ICO for {app.nameApp} | Play Market 2.0 Developer Module</title>
                            </Helmet>
                            <div className="ico-add__control">
                                <Link className="ico-add__control__back" to="/apps">Applications</Link>
                            </div>
                            <div className="ico-add__title">Start ICO for <span>"{app.nameApp}"</span></div>
                            {
                                !info.success ? (
                                    <form onSubmit={this.handleSubmitUpload}>
                                        <section className="ico-add__section ico-add__section-1">
                                            <div className="ico-add__section__title">ICO settings</div>
                                            <div className="ico-add__section-1__content">
                                                <div className="ico-add__section-1__content--left">
                                                    <ul className="ico-add__section-1__content__list">
                                                        <li className="ico-add__section-1__content__list-item">
                                                            <div className="ico-add__section-1__content__list-item__title">Token name:</div>
                                                            <div className="ico-add__section-1__content__list-item__input">
                                                                <input required placeholder="Play Market Token" type="text" value={tokenName} onChange={this.handleChangeTokenName}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-1__content__list-item">
                                                            <div className="ico-add__section-1__content__list-item__title">Token symbol:</div>
                                                            <div className="ico-add__section-1__content__list-item__input">
                                                                <input required placeholder="PMT" type="text" value={tokenSymbol} onChange={this.handleChangeTokenSymbol}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-1__content__list-item">
                                                            <div className="ico-add__section-1__content__list-item__title">Hard cup USD:</div>
                                                            <div className="ico-add__section-1__content__list-item__input">
                                                                <input required placeholder="1500000" min="1" type="number" value={hardCapUSD} onChange={this.handleChangeHardCapUSD}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="ico-add__section-1__content--right">
                                                    <div className="ico-add__section-1__content__date">
                                                        <div className="ico-add__section-1__content__date__title">Start time:</div>
                                                        <div className="ico-add__section-1__content__date-box">
                                                            <div className="ico-add__section-1__content__date-box__picker">
                                                                <DatetimePickerTrigger moment={startDate} minDate={minDate} onChange={this.handleChangeStartDate}>
                                                                    <div className="ico-add__section-1__content__date-box__picker-btn">Select date</div>
                                                                </DatetimePickerTrigger>
                                                            </div>
                                                            <ul className="ico-add__section-1__content__date-box__list">
                                                                <li className="ico-add__section-1__content__date-box__list-item">
                                                                    <div className="ico-add__section-1__content__date-box__list-item__title">Your time zone:</div>
                                                                    <div className="ico-add__section-1__content__date__list-item__value">{startDate.format('MMMM Do YYYY, HH:mm:ss')}</div>
                                                                </li>
                                                                <li className="ico-add__section-1__content__date-box__list-item">
                                                                    <div className="ico-add__section-1__content__date-box__list-item__title">GMT:</div>
                                                                    <div className="ico-add__section-1__content__date-box__list-item__value">{moment.utc(startDate).format('MMMM Do YYYY, HH:mm:ss')}</div>
                                                                </li>
                                                                <li className="ico-add__section-1__content__date-box__list-item">
                                                                    <div className="ico-add__section-1__content__date-box__list-item__title">Timestamp:</div>
                                                                    <div className="ico-add__section-1__content__date-box__list-item__value">{startDate.unix()}</div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="ico-add__section-1__content__warning">
                                                        The system will automatically issue a token and will place the app in exchange ICO, stop or significantly change the settings of ICO will not be possible until its completion.
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <section className="ico-add__section ico-add__section-2">
                                            <div className="ico-add__section__title">ICO information</div>
                                            <div className="ico-add__section-2__content">
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">description</div>
                                                    <ul className="ico-add__section-2__content__box__description">
                                                        <li className="ico-add__section-2__content__box__description-item">
                                                            <div className="ico-add__section-2__content__box__description-item__title">about ico</div>
                                                            <div className="ico-add__section-2__content__box__description-item__content">
                                                                <div className="ico-add__section-2__content__box__description-item__content__gallery">
                                                                    {
                                                                        description.length > 0 ? (
                                                                            <ul className="ico-add__section-2__content__box__description-item__content__gallery__preview-list">
                                                                                {
                                                                                    description.map((file, index) => {
                                                                                        return (
                                                                                            <li className="ico-add__section-2__content__box__description-item__content__gallery__preview-list__item" key={index} >
                                                                                                <div className="ico-add__section-2__content__box__description-item__content__gallery__preview-list__item__remove" onClick={this.handleRemoveDescriptionImage('description', index)} data-index={index} title="Remove image">Delete</div>
                                                                                                <img src={file.imageBase64} title={file.name} alt="PREVIEW"/>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        ) : null
                                                                    }
                                                                    {
                                                                        description.length < 7 ? (
                                                                            <div className="ico-add__section-2__content__box__description-item__content__gallery__input">
                                                                                <div className="ico-add__section-2__content__box__description-item__content__gallery__input-text"><span>+</span>Add image</div>
                                                                                <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeDescriptionImage('description')}/>
                                                                            </div>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                                <div className="ico-add__section-2__content__box__description-item__content__textarea">
                                                                    <TextareaAutosize required placeholder="DAO PlayMarket 2.0 is a decentralized Android App Store that accepts payments in cryptocurrency and is combined with an ICO platform for developers." minRows={1} value={ico.description.text} onChange={this.handleChangeDescriptionText('description')}/>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__description-item">
                                                            <div className="ico-add__section-2__content__box__description-item__title">investors advantages</div>
                                                            <div className="ico-add__section-2__content__box__description-item__content">
                                                                <div className="ico-add__section-2__content__box__description-item__content__gallery">
                                                                    {
                                                                        advantages.length > 0 ? (
                                                                            <ul className="ico-add__section-2__content__box__description-item__content__gallery__preview-list">
                                                                                {
                                                                                    advantages.map((file, index) => {
                                                                                        return (
                                                                                            <li className="ico-add__section-2__content__box__description-item__content__gallery__preview-list__item" key={index} >
                                                                                                <div className="ico-add__section-2__content__box__description-item__content__gallery__preview-list__item__remove" onClick={this.handleRemoveDescriptionImage('advantages', index)} data-index={index} title="Remove image">Delete</div>
                                                                                                <img src={file.imageBase64} title={file.name} alt="PREVIEW"/>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        ) : null
                                                                    }
                                                                    {
                                                                        advantages.length < 7 ? (
                                                                            <div className="ico-add__section-2__content__box__description-item__content__gallery__input">
                                                                                <div className="ico-add__section-2__content__box__description-item__content__gallery__input-text"><span>+</span>Add image</div>
                                                                                <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeDescriptionImage('advantages')}/>
                                                                            </div>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                                <div className="ico-add__section-2__content__box__description-item__content__textarea">
                                                                    <TextareaAutosize required placeholder="Investors who participate in the crowdsale of the DAO PlayMarket 2.0 will receive dividend income from the PlayMarket Foundation. This fund will be replenished by a 5% commission fee, paid by developers who issue their own tokens of their applications. The platform will host a built-in crypto-exchange PEX. It will be possible to exchange tokens of the platform and applications to fiat or other cryptocurrencies and back. The exchange will be decentralized, and therefore more resistant to possible hacker attacks." minRows={1} value={ico.advantages.text} onChange={this.handleChangeDescriptionText('advantages')}/>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">multimedia</div>
                                                    <div className="ico-add__section-2__content__box__logo-banner">
                                                        <div className="ico-add__section-2__content__box__logo-banner__logo-box">
                                                            <div className="ico-add__section-2__content__box__logo-banner__logo-box__title">Logo</div>
                                                            <div className="ico-add__section-2__content__box__logo-banner__logo-box__logo">
                                                                {
                                                                    logo ? (
                                                                        <img src={logo.imageBase64} alt="PREVIEW"/>
                                                                    ) : (
                                                                        <div className="ico-add__section-2__content__box__logo-banner__logo-box__logo__placeholder">Add image</div>
                                                                    )
                                                                }
                                                                <input  type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeLogo}/>
                                                            </div>
                                                        </div>
                                                        <div className="ico-add__section-2__content__box__logo-banner__banner-box">
                                                            <div className="ico-add__section-2__content__box__logo-banner__banner-box__title">Banner (horizontal image)</div>
                                                            <div className="ico-add__section-2__content__box__logo-banner__banner-box__banner">
                                                                {
                                                                    banner ? (
                                                                        <img src={banner.imageBase64} alt="PREVIEW"/>
                                                                    ) : (
                                                                        <div className="ico-add__section-2__content__box__logo-banner__banner-box__banner__placeholder">Add image</div>
                                                                    )
                                                                }
                                                                <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeBanner}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ico-add__section-2__content__box__gallery">
                                                        <div className="ico-add__section-2__content__box__gallery__title">Gallery</div>
                                                        <div className="ico-add__section-2__content__box__gallery-box">
                                                            {
                                                                gallery.length > 0 ? (
                                                                    <ul className="ico-add__section-2__content__box__gallery-box__preview-list">
                                                                        {
                                                                            gallery.length ? (
                                                                                gallery.map((file, index) => {
                                                                                    return (
                                                                                        <li className="ico-add__section-2__content__box__gallery-box__preview-list__item" key={index} >
                                                                                            <div className="ico-add__section-2__content__box__gallery-box__preview-list__item__remove" onClick={this.handleRemoveGalleryItem} data-index={index} title="Remove image">Delete</div>
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
                                                                gallery.length < 7 ? (
                                                                    <div className="ico-add__section-2__content__box__gallery-box__input">
                                                                        <div className="ico-add__section-2__content__box__gallery-box__input-text"><span>+</span>Add image</div>
                                                                        <input type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeGallery}/>
                                                                    </div>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">files</div>
                                                    <ul className="ico-add__section-2__content__box__document">
                                                        <li className="ico-add__section-2__content__box__document-item">
                                                            <div className="ico-add__section-2__content__box__document-item__title">White Paper</div>
                                                            <div className="ico-add__section-2__content__box__document-item__box">
                                                                {ico.files.whitepaper ? (
                                                                    <div className="ico-add__section-2__content__box__document-item__box__preview">
                                                                        <div className="ico-add__section-2__content__box__document-item__box__preview__img"></div>
                                                                        <ul className="ico-add__section-2__content__box__document-item__box__preview__info-list">
                                                                            <li className="ico-add__section-2__content__box__document-item__box__preview__info-list__item">Name: <span>{ico.files.whitepaper.name}</span></li>
                                                                            <li className="ico-add__section-2__content__box__document-item__box__preview__info-list__item">Size: <span>{filesize(ico.files.whitepaper.size)}</span></li>
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <div className="ico-add__section-2__content__box__document-item__box__preview__placeholder">Select PDF file</div>
                                                                )}
                                                                <input type="file" accept=".pdf" onChange={this.handleChangeDocument('whitepaper')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__document-item">
                                                            <div className="ico-add__section-2__content__box__document-item__title">One Page Paper</div>
                                                            <div className="ico-add__section-2__content__box__document-item__box">
                                                                {ico.files.onepage ? (
                                                                    <div className="ico-add__section-2__content__box__document-item__box__preview">
                                                                        <div className="ico-add__section-2__content__box__document-item__box__preview__img"></div>
                                                                        <ul className="ico-add__section-2__content__box__document-item__box__preview__info-list">
                                                                            <li className="ico-add__section-2__content__box__document-item__box__preview__info-list__item">Name: <span>{ico.files.onepage.name}</span></li>
                                                                            <li className="ico-add__section-2__content__box__document-item__box__preview__info-list__item">Size: <span>{filesize(ico.files.onepage.size)}</span></li>
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <div className="ico-add__section-2__content__box__document-item__box__preview__placeholder">Select PDF file</div>
                                                                )}
                                                                <input type="file" accept=".pdf" onChange={this.handleChangeDocument('onepage')}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">contacts</div>
                                                    <div className="ico-add__section-2__content__box__contacts">
                                                        <ul className="ico-add__section-2__content__box__contacts__list">
                                                            <li className="ico-add__section-2__content__box__contacts__list--item">
                                                                <div className="ico-add__section-2__content__box__contacts__list--item__title">EMAIL</div>
                                                                <div className="ico-add__section-2__content__box__contacts__list--item__input">
                                                                    <input required placeholder="support@playmarket.io" type="email" name='email' value={email} onChange={this.handleChangeText}/>
                                                                </div>
                                                            </li>
                                                            <li className="ico-add__section-2__content__box__contacts__list--item">
                                                                <div className="ico-add__section-2__content__box__contacts__list--item__title">Application website URL</div>
                                                                <div className="ico-add__section-2__content__box__contacts__list--item__input">
                                                                    <input placeholder="https://playmarket.io" type="text" name='urlICO' value={urlICO} onChange={this.handleChangeText}/>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <div className="ico-add__section-2__content__box__contacts__social">
                                                            <div className="ico-add__section-2__content__box__contacts__social__title">Social links</div>
                                                            <ul className="ico-add__section-2__content__box__contacts__social-list">
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">Google+</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://plus.google.com/example" type="text" name="googlePlus" value={ico.social.googlePlus} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">Facebook</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://www.facebook.com/example" type="text" name="facebook" value={ico.social.facebook} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">LinkedIn</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://www.linkedin.com/in/example" type="text" name="linkedin" value={ico.social.linkedin} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">Instagram</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://www.instagram.com/example" type="text" name="instagram" value={ico.social.instagram} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">VK</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input type="text" placeholder="https://vk.com/example" name="vk" value={ico.social.vk} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">YouTube</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://www.youtube.com/channel/example" type="text" name="youtube" value={ico.social.youtube} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">Telegram</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://telegram.me/joinchat/example" type="text" name="telegram" value={ico.social.telegram} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">GitHub</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://github.com/example" type="text" name="gitHub" value={ico.social.gitHub} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                                <li className="ico-add__section-2__content__box__contacts__social-list--item">
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__title">Twitter</div>
                                                                    <div className="ico-add__section-2__content__box__contacts__social-list--item__input">
                                                                        <input placeholder="https://twitter.com/example" type="text" name="twitter" value={ico.social.twitter} onChange={this.handleChangeSocial}/>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">keywords</div>
                                                    <div className="ico-add__section-2__content__box__keywords">
                                                        <ul className="ico-add__section-2__content__box__keywords__list">
                                                            {
                                                                ico.keywords.length ? (
                                                                    ico.keywords.map((item, index) => {
                                                                        return (
                                                                            <li className="ico-add__section-2__content__box__keywords__list-item" key={index}>
                                                                                <div className="ico-add__section-2__content__box__keywords__list-item__value">{item}</div>
                                                                                <div className="ico-add__section-2__content__box__keywords__list-item__remove" onClick={this.handleRemoveKeyword(index)} title="Remove"></div>
                                                                            </li>
                                                                        )
                                                                    })
                                                                ): (
                                                                    <div className="ico-add__section-2__content__box__keywords__list-placeholder">Keywords not specified</div>
                                                                )
                                                            }
                                                        </ul>
                                                        <div className="ico-add__section-2__content__box__keywords__add">
                                                            <input className="ico-add__section-2__content__box__keywords__add-input" type="text" value={keyword} onChange={this.handleChangeKeyword}/>
                                                            <div className="ico-add__section-2__content__box__keywords__add-btn" onClick={this.handleAddKeyword}>add</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">something else</div>
                                                    <ul className="ico-add__section-2__content__box__stuff">
                                                        <li className="ico-add__section-2__content__box__stuff-item">
                                                            <div className="ico-add__section-2__content__box__stuff-item__title">Privacy policy URL</div>
                                                            <div className="ico-add__section-2__content__box__stuff-item__input">
                                                                <input placeholder="https://playmarket.io/privacy-policy" type="text" name="privacyPolicy" value={ico.privacyPolicy} onChange={this.handleChangeText}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__stuff-item">
                                                            <div className="ico-add__section-2__content__box__stuff-item__title">YouTube video ID</div>
                                                            <div className="ico-add__section-2__content__box__stuff-item__input">
                                                                <input placeholder="QYjyfCt6gWc" type="text" name="youtubeID" value={ico.youtubeID} onChange={this.handleChangeText}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="ico-add__section-2__content__box">
                                                    <div className="ico-add__section-2__content__box__title">members</div>
                                                    <ul className="ico-add__section-2__content__box__members">
                                                        <li className="ico-add__section-2__content__box__members-item">
                                                            <div className="ico-add__section-2__content__box__members-item__title">team</div>
                                                            <ul className="ico-add__section-2__content__box__members-item__list">
                                                                {
                                                                    ico.members.team.length ? (
                                                                        ico.members.team.map((item, index) => {
                                                                            return (
                                                                                <li className="ico-add__section-2__content__box__members-item__list-item" key={index}>
                                                                                    <div className="ico-add__section-2__content__box__members-item__list-item__photo">
                                                                                        {item.photo ? (
                                                                                            <img src={members.team[index].imageBase64} title={members.team[index].name} alt="PREVIEW"/>
                                                                                        ) : (
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__photo__placeholder">No photo</div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="ico-add__section-2__content__box__members-item__list-item__desc">
                                                                                        <div className="ico-add__section-2__content__box__members-item__list-item__desc__main">
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__desc__main__name">
                                                                                                <div className="ico-add__section-2__content__box__members-item__list-item__desc__main__name__title">Name:</div>
                                                                                                <div className="ico-add__section-2__content__box__members-item__list-item__desc__main__name__value">{item.name}</div>
                                                                                            </div>
                                                                                            <ul className="ico-add__section-2__content__box__members-item__list-item__desc__main__social">
                                                                                                {!!item.social.googlePlus ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.googlePlus} target="_blank" title="Google+" data-social="googlePlus">Google+</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.facebook ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.facebook} target="_blank" title="Facebook" data-social="facebook">Facebook</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.linkedin ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.linkedin} target="_blank" title="LinkedIn" data-social="linkedin">LinkedIn</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.instagram ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.instagram} target="_blank" title="Instagram" data-social="instagram">Instagram</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.vk ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.vk} target="_blank" title="VK" data-social="vk">VK</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.youtube ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.youtube} target="_blank" title="YouTube" data-social="youtube">YouTube</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.telegram ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.telegram} target="_blank" title="Telegram" data-social="telegram">Telegram</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.gitHub ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.gitHub} target="_blank" title="GitHub" data-social="gitHub">GitHub</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.twitter ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.twitter} target="_blank" title="Twitter" data-social="twitter">Twitter</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                            </ul>
                                                                                        </div>
                                                                                        <div className="ico-add__section-2__content__box__members-item__list-item__desc__text">
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__desc__text__title">Description:</div>
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__desc__text__value">{item.description}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="ico-add__section-2__content__box__members-item__list-item__remove" onClick={this.handleClickRemoveMember('team', index)}>Remove</div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                        <div className="ico-add__section-2__content__box__members-item__list__placeholder">
                                                                            The team list is empty
                                                                        </div>
                                                                    )
                                                                }

                                                            </ul>
                                                            <div className="ico-add__section-2__content__box__members-item__add">
                                                                <div className="ico-add__section-2__content__box__members-item__add__main">
                                                                    <div className="ico-add__section-2__content__box__members-item__add__main__photo">
                                                                        {members.temp.team.photoPreview ? (<img src={members.temp.team.photoPreview.imageBase64} alt="PREVIEW"/>) : null}
                                                                        <div className={"ico-add__section-2__content__box__members-item__add__main__photo__placeholder " + (members.temp.team.photoPreview  ? '' : 'visible')}>Add photo</div>
                                                                        <input id="team_logo" type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeMemberPhoto('team')}/>
                                                                    </div>
                                                                    <div className="ico-add__section-2__content__box__members-item__add__main__description">
                                                                        <div className="ico-add__section-2__content__box__members-item__add__main__description__box">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__title">Name:</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__input">
                                                                                <input type="text" placeholder="John Doe" value={members.temp.team.name} onChange={this.handleChangeMemberName('team')}/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ico-add__section-2__content__box__members-item__add__main__description__box">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__title">Description:</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__input">
                                                                                <TextareaAutosize className="ico-add__section-2__content__box__members-item__add__main__description__text" placeholder="He is a great man" minRows={1} name='description' value={members.temp.team.description} onChange={this.handleChangeMemberDescription('team')}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ico-add__section-2__content__box__members-item__add__social">
                                                                    <div className="ico-add__section-2__content__box__members-item__add__social__title">Social links</div>
                                                                    <ul className="ico-add__section-2__content__box__members-item__add__social__list">
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Google+</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://plus.google.com/example" type="text" name="googlePlus" value={members.temp.team.social.googlePlus} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Facebook</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.facebook.com/example" type="text" name="facebook" value={members.temp.team.social.facebook} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">LinkedIn</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.linkedin.com/in/example" type="text" name="linkedin" value={members.temp.team.social.linkedin} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Instagram</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.instagram.com/example" type="text" name="instagram" value={members.temp.team.social.instagram} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">VK</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://vk.com/example" type="text" name="vk" value={members.temp.team.social.vk} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">YouTube</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.youtube.com/channel/example" type="text" name="youtube" value={members.temp.team.social.youtube} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Telegram</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://telegram.me/joinchat/example" type="text" name="telegram" value={members.temp.team.social.telegram} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">GitHub</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://github.com/example" type="text" name="gitHub" value={members.temp.team.social.gitHub} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Twitter</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://twitter.com/example" type="text" name="twitter" value={members.temp.team.social.twitter} onChange={this.handleChangeMemberSocial('team')}/>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="ico-add__section-2__content__box__members-item__add__btn-block">
                                                                    <div className="ico-add__section-2__content__box__members-item__add__btn-block__btn" onClick={this.handleSubmitAddMember('team')}>Add team member</div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members-item">
                                                            <div className="ico-add__section-2__content__box__members-item__title">advisors</div>
                                                            <ul className="ico-add__section-2__content__box__members-item__list">
                                                                {
                                                                    ico.members.advisors.length ? (
                                                                        ico.members.advisors.map((item, index) => {
                                                                            return (
                                                                                <li className="ico-add__section-2__content__box__members-item__list-item" key={index}>
                                                                                    <div className="ico-add__section-2__content__box__members-item__list-item__photo">
                                                                                        {item.photo ? (
                                                                                            <img src={members.advisors[index].imageBase64}  title={members.advisors[index].name} alt="PREVIEW"/>
                                                                                        ) : (
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__photo__placeholder">No photo</div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="ico-add__section-2__content__box__members-item__list-item__desc">
                                                                                        <div className="ico-add__section-2__content__box__members-item__list-item__desc__main">
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__desc__main__name">
                                                                                                <div className="ico-add__section-2__content__box__members-item__list-item__desc__main__name__title">Name:</div>
                                                                                                <div className="ico-add__section-2__content__box__members-item__list-item__desc__main__name__value">{item.name}</div>
                                                                                            </div>
                                                                                            <ul className="ico-add__section-2__content__box__members-item__list-item__desc__main__social">
                                                                                                {!!item.social.googlePlus ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.googlePlus} target="_blank" title="Google+" data-social="googlePlus">Google+</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.facebook ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.facebook} target="_blank" title="Facebook" data-social="facebook">Facebook</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.linkedin ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.linkedin} target="_blank" title="LinkedIn" data-social="linkedin">LinkedIn</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.instagram ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.instagram} target="_blank" title="Instagram" data-social="instagram">Instagram</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.vk ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.vk} target="_blank" title="VK" data-social="vk">VK</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.youtube ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.youtube} target="_blank" title="YouTube" data-social="youtube">YouTube</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.telegram ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.telegram} target="_blank" title="Telegram" data-social="telegram">Telegram</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.gitHub ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.gitHub} target="_blank" title="GitHub" data-social="gitHub">GitHub</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                                {!!item.social.twitter ? (
                                                                                                    <li className="ico-add__section-2__content__box__members-item__list-item__desc__main__social-item">
                                                                                                        <a href={item.social.twitter} target="_blank" title="Twitter" data-social="twitter">Twitter</a>
                                                                                                    </li>
                                                                                                ) : null}
                                                                                            </ul>
                                                                                        </div>
                                                                                        <div className="ico-add__section-2__content__box__members-item__list-item__desc__text">
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__desc__text__title">Description:</div>
                                                                                            <div className="ico-add__section-2__content__box__members-item__list-item__desc__text__value">{item.description}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="ico-add__section-2__content__box__members-item__list-item__remove" onClick={this.handleClickRemoveMember('advisors', index)}>Remove</div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                        <div className="ico-add__section-2__content__box__members-item__list__placeholder">
                                                                            The advisors list is empty
                                                                        </div>
                                                                    )
                                                                }

                                                            </ul>
                                                            <div className="ico-add__section-2__content__box__members-item__add">
                                                                <div className="ico-add__section-2__content__box__members-item__add__main">
                                                                    <div className="ico-add__section-2__content__box__members-item__add__main__photo">
                                                                        {members.temp.advisors.photoPreview ? (<img src={members.temp.advisors.photoPreview.imageBase64} alt="PREVIEW"/>) : null}
                                                                        <div className={"ico-add__section-2__content__box__members-item__add__main__photo__placeholder " + (members.temp.advisors.photoPreview  ? '' : 'visible')}>Add photo</div>
                                                                        <input id="advisors_logo" type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeMemberPhoto('advisors')}/>
                                                                    </div>
                                                                    <div className="ico-add__section-2__content__box__members-item__add__main__description">
                                                                        <div className="ico-add__section-2__content__box__members-item__add__main__description__box">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__title">Name:</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__input">
                                                                                <input type="text" placeholder="John Doe" value={members.temp.advisors.name} onChange={this.handleChangeMemberName('advisors')}/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ico-add__section-2__content__box__members-item__add__main__description__box">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__title">Description:</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__main__description__box__input">
                                                                                <TextareaAutosize className="ico-add__section-2__content__box__members-item__add__main__description__text" placeholder="He is a great man" minRows={1} name='description' value={members.temp.advisors.description} onChange={this.handleChangeMemberDescription('advisors')}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="ico-add__section-2__content__box__members-item__add__social">
                                                                    <div className="ico-add__section-2__content__box__members-item__add__social__title">Social links</div>
                                                                    <ul className="ico-add__section-2__content__box__members-item__add__social__list">
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Google+</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://plus.google.com/example" type="text" name="googlePlus" value={members.temp.advisors.social.googlePlus} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Facebook</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.facebook.com/example" type="text" name="facebook" value={members.temp.advisors.social.facebook} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">LinkedIn</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.linkedin.com/in/example" type="text" name="linkedin" value={members.temp.advisors.social.linkedin} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Instagram</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.instagram.com/example" type="text" name="instagram" value={members.temp.advisors.social.instagram} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">VK</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://vk.com/example" type="text" name="vk" value={members.temp.advisors.social.vk} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">YouTube</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://www.youtube.com/channel/example" type="text" name="youtube" value={members.temp.advisors.social.youtube} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Telegram</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://telegram.me/joinchat/example" type="text" name="telegram" value={members.temp.advisors.social.telegram} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">GitHub</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://github.com/example" type="text" name="gitHub" value={members.temp.advisors.social.gitHub} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                        <li className="ico-add__section-2__content__box__members-item__add__social__list-item">
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__title">Twitter</div>
                                                                            <div className="ico-add__section-2__content__box__members-item__add__social__list-item__input">
                                                                                <input placeholder="https://twitter.com/example" type="text" name="twitter" value={members.temp.advisors.social.twitter} onChange={this.handleChangeMemberSocial('advisors')}/>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="ico-add__section-2__content__box__members-item__add__btn-block">
                                                                    <div className="ico-add__section-2__content__box__members-item__add__btn-block__btn" onClick={this.handleSubmitAddMember('advisors')}>Add advisor</div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="ico-add__load-block">
                                            <button className="app-add__load-block__btn">Upload</button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={this.handleSubmitCreate}>
                                        <section className="ico-add__section ico-add__section-3">
                                            <div className="ico-add__section__title">ico contract</div>
                                            <div className="ico-add__section-3__content">
                                                <div className="ico-add__section-3__content--left">
                                                    <ul className="ico-add__section-3__content__list">
                                                        <li className="ico-add__section-3__content__list-item">
                                                            <div className="ico-add__section-3__content__list-item__title">Multisignature wallet:</div>
                                                            <div className="ico-add__section-3__content__list-item__input">
                                                                <input required placeholder="0x1234567891234567891234567891234567891234" type="text" value={multisigWallet} onChange={this.handleChangemMltisigWallet}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-3__content__list-item">
                                                            <div className="ico-add__section-3__content__list-item__title">Token standard:</div>
                                                            <ul className="ico-add__section-3__content__list-item__radio">
                                                                <li className="ico-add__section-3__content__list-item__radio-item">
                                                                    <input id="ATID_1" checked={ATID === 1} name="ATID" type="radio" value="1" onChange={this.handleChangeATID}/>
                                                                    <label htmlFor="ATID_1" title="ERC20 is a technical standard used for smart contracts on the Ethereum blockchain for implementing tokens. ERC stands for Ethereum Request for Comment, and 20 is the number that was assigned to this request. The clear majority of tokens issued on the Ethereum blockchain are ERC20 compliant.">ERC20 (v. 1.0.0)</label>
                                                                </li>
                                                                <li className="ico-add__section-3__content__list-item__radio-item">
                                                                    <input id="ATID_2" checked={ATID === 2} name="ATID" type="radio" value="2" onChange={this.handleChangeATID}/>
                                                                    <label htmlFor="ATID_2" title="ERC223 is a token standard that allows token transfers to behave exactly as ether transactions. ERC223 utilizes event handling (considers a transaction an event) to prevent tokens from being lost in unhandled transactions.">ERC223 (v. 1.0.0)</label>
                                                                </li>
                                                                {/*<li className="ico-add__section-3__content__list-item__radio-item">*/}
                                                                    {/*<input id="ATID_3" checked={ATID === 3} name="ATID" type="radio" value="3" onChange={this.handleChangeATID}/>*/}
                                                                    {/*<label htmlFor="ATID_3" title="ERC20 is a technical standard used for smart contracts on the Ethereum blockchain for implementing tokens. ERC stands for Ethereum Request for Comment, and 20 is the number that was assigned to this request. The clear majority of tokens issued on the Ethereum blockchain are ERC20 compliant.">ERC20 (v. 2.0.0)</label>*/}
                                                                {/*</li>*/}
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="ico-add__load-block ico-add__load-block--space-between">
                                            <div className="ico-add__load-block__back" onClick={this.handleClickBackToAddInfo}>change info</div>
                                            <button className="ico-add__load-block__btn">Next</button>
                                        </div>
                                    </form>
                                )
                            }
                            <Popup className="ico-add-popup" open={popupOpen} onClose={this.closeModal}>
                                <div>
                                    {
                                        this.state.isUpload ? (
                                            <div>
                                                <div className="ico-add-popup__main">
                                                    <h3 className="ico-add-popup__main__title">Account info</h3>
                                                    <ul className="ico-add-popup__main__list">
                                                        <li className="ico-add-popup__main__list-item">
                                                            <div className="ico-add-popup__main__list-item__title">Address:</div>
                                                            <div className="ico-add-popup__main__list-item__value">{address}</div>
                                                        </li>
                                                        <li className="ico-add-popup__main__list-item">
                                                            <div className="ico-add-popup__main__list-item__title">Balance:</div>
                                                            <div className="ico-add-popup__main__list-item__value">{web3Utils.fromWei(balance, 'ether')} <span>ETH</span></div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {
                                                    info.success && contract.success ? (
                                                        <form className="ico-add-popup__registration" onSubmit={this.handleSubmitRegistration_5}>
                                                            <h3 className="ico-add-popup__registration__title">create ico</h3>
                                                            <div className="ico-add-popup__registration__subtitle">Your ICO is successfully registered!<br/>After moderation and confirmation it will available on the Play Market 2.0 platform.</div>
                                                            <div className="ico-add-popup__btn-block ico-add-popup__btn-block--center">
                                                                <button className="ico-add-popup__btn-block__btn">OK</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div>
                                                            {
                                                                !info.success ? (
                                                                    <div>
                                                                    {
                                                                        info.step === 1 ? (
                                                                            <form className="ico-add-popup__registration"
                                                                                  onSubmit={this.handleSubmitRegistration_1}>
                                                                                <h3 className="ico-add-popup__registration__title">
                                                                                    Add application ICO info</h3>
                                                                                <div
                                                                                    className="ico-add-popup__registration__subtitle">
                                                                                    Confirmation of the transaction data
                                                                                </div>
                                                                                <ul className="ico-add-popup__registration__preview-list">
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            App ID:
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{app.idApp}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Token name:
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{tokenName}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Token symbol:
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{tokenSymbol}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Start time (timestamp):
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{startDate.unix()}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Periods:
                                                                                        </div>
                                                                                        <div className="ico-add-popup__registration__preview-list__item--value">{periods}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Hard Cup (USD):
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{hardCapUSD}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Hash:
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{hash}</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__preview-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--title">
                                                                                            Hash type:
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__preview-list__item--value">{hashType}</div>
                                                                                    </li>
                                                                                </ul>
                                                                                <ul className="ico-add-popup__registration__list">
                                                                                    <li className="ico-add-popup__registration__list-item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__list-item__title">
                                                                                            Gas Limit:
                                                                                        </div>
                                                                                        <input
                                                                                            className="ico-add-popup__registration__list-item__input"
                                                                                            required type="number"
                                                                                            value={info.gasLimit}
                                                                                            onChange={this.handleChangeTxParams('info', 'gasLimit')}/>
                                                                                    </li>
                                                                                </ul>
                                                                                <ul className="ico-add-popup__registration__fee-list">
                                                                                    <li className="ico-add-popup__registration__fee-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__fee-list__item--title">
                                                                                            Gas Price:
                                                                                        </div>
                                                                                        <div className="ico-add-popup__registration__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')}&nbsp;Gwei</div>
                                                                                    </li>
                                                                                    <li className="ico-add-popup__registration__fee-list__item">
                                                                                        <div
                                                                                            className="ico-add-popup__registration__fee-list__item--title">
                                                                                            Approximate fee:
                                                                                        </div>
                                                                                        <div
                                                                                            className="ico-add-popup__registration__fee-list__item--value">{web3Utils.fromWei((gasPrice * info.gasLimit).toString(), 'ether')}</div>
                                                                                    </li>
                                                                                </ul>
                                                                                <div className="ico-add-popup__btn-block">
                                                                                    <button
                                                                                        className="ico-add-popup__btn-block__btn">
                                                                                        Accept
                                                                                    </button>
                                                                                    <div
                                                                                        className="ico-add-popup__btn-block__btn--cancel"
                                                                                        onClick={this.closeModal}>Cancel
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        ) : null
                                                                    }
                                                                    {
                                                                        info.step === 2 ? (
                                                                            <form className="ico-add-popup__registration" onSubmit={this.handleSubmitRegistration_2}>
                                                                                <h3 className="ico-add-popup__registration__title">Add application ICO info</h3>
                                                                                <div className="ico-add-popup__registration__subtitle">Sending transaction</div>
                                                                                {
                                                                                    mode === 'keystore' ? (
                                                                                        <ul className="ico-add-popup__registration__list">
                                                                                            <li className="ico-add-popup__registration__list-item">
                                                                                                <div
                                                                                                    className="ico-add-popup__registration__list-item__title">
                                                                                                    Keystore password:
                                                                                                </div>
                                                                                                <input
                                                                                                    className="ico-add-popup__registration__list-item__input"
                                                                                                    required type="password"
                                                                                                    value={info.password}
                                                                                                    onChange={this.handleChangeTxParams('info', 'password')}/>
                                                                                            </li>
                                                                                        </ul>
                                                                                    ) : null
                                                                                }
                                                                                <div className="ico-add-popup__btn-block">
                                                                                    <button className="ico-add-popup__btn-block__btn">send tx</button>
                                                                                    <div className="ico-add-popup__btn-block__btn--cancel" onClick={this.handleClickBackPopup('info', 1)}>Back</div>
                                                                                </div>
                                                                            </form>
                                                                        ) : null
                                                                    }
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        {
                                                                            contract.step === 1 ? (
                                                                                <form className="ico-add-popup__registration"
                                                                                      onSubmit={this.handleSubmitRegistration_3}>
                                                                                    <h3 className="ico-add-popup__registration__title">
                                                                                        create ico contract</h3>
                                                                                    <div
                                                                                        className="ico-add-popup__registration__subtitle">
                                                                                        Confirmation of the transaction data
                                                                                    </div>
                                                                                    <ul className="ico-add-popup__registration__preview-list">
                                                                                        <li className="ico-add-popup__registration__preview-list__item">
                                                                                            <div
                                                                                                className="ico-add-popup__registration__preview-list__item--title">
                                                                                                App ID:
                                                                                            </div>
                                                                                            <div
                                                                                                className="ico-add-popup__registration__preview-list__item--value">{app.idApp}</div>
                                                                                        </li>
                                                                                        <li className="ico-add-popup__registration__preview-list__item">
                                                                                            <div
                                                                                                className="ico-add-popup__registration__preview-list__item--title">
                                                                                                Multisignature wallet:
                                                                                            </div>
                                                                                            <div
                                                                                                className="ico-add-popup__registration__preview-list__item--value">{multisigWallet}</div>
                                                                                        </li>
                                                                                        <li className="ico-add-popup__registration__preview-list__item">
                                                                                            <div
                                                                                                className="ico-add-popup__registration__preview-list__item--title">
                                                                                                Token standard:
                                                                                            </div>
                                                                                            <div className="ico-add-popup__registration__preview-list__item--value">
                                                                                                {ATID === 1 ? 'ERC20 (v 1.0.0)' : null}
                                                                                                {ATID === 2 ? 'ERC223 (v 1.0.0)' : null}
                                                                                                {ATID === 3 ? 'ERC20 (v 2.0.0)' : null}
                                                                                            </div>
                                                                                        </li>
                                                                                        <li className="ico-add-popup__registration__preview-list__item">
                                                                                            <div className="ico-add-popup__registration__preview-list__item--title">Crowdsale type:</div>
                                                                                            <div className="ico-add-popup__registration__preview-list__item--value">
                                                                                                {CSID === 1 ? 'CSID (v 1.0.0)' : null}
                                                                                                {CSID === 2 ? 'CSID (v 2.0.0)' : null}
                                                                                            </div>
                                                                                        </li>
                                                                                        <li className="ico-add-popup__registration__preview-list__item">
                                                                                            <div className="ico-add-popup__registration__preview-list__item--title">Number of periods:</div>
                                                                                            <div className="ico-add-popup__registration__preview-list__item--value">{periods}</div>
                                                                                        </li>
                                                                                    </ul>
                                                                                    <ul className="ico-add-popup__registration__list">
                                                                                        <li className="ico-add-popup__registration__list-item">
                                                                                            <div
                                                                                                className="ico-add-popup__registration__list-item__title">
                                                                                                Gas Limit:
                                                                                            </div>
                                                                                            <input
                                                                                                className="ico-add-popup__registration__list-item__input"
                                                                                                required type="number"
                                                                                                value={info.gasLimit}
                                                                                                onChange={this.handleChangeTxParams('contract', 'gasLimit')}/>
                                                                                        </li>
                                                                                    </ul>
                                                                                    <ul className="ico-add-popup__registration__fee-list">
                                                                                        <li className="ico-add-popup__registration__fee-list__item">
                                                                                            <div
                                                                                                className="ico-add-popup__registration__fee-list__item--title">
                                                                                                Gas Price:
                                                                                            </div>
                                                                                            <div
                                                                                                className="ico-add-popup__registration__fee-list__item--value">{web3Utils.fromWei(gasPrice, 'gwei')}Gwei
                                                                                            </div>
                                                                                        </li>
                                                                                        <li className="ico-add-popup__registration__fee-list__item">
                                                                                            <div
                                                                                                className="ico-add-popup__registration__fee-list__item--title">
                                                                                                Approximate fee:
                                                                                            </div>
                                                                                            <div
                                                                                                className="ico-add-popup__registration__fee-list__item--value">{web3Utils.fromWei((gasPrice * contract.gasLimit).toString(), 'ether')}</div>
                                                                                        </li>
                                                                                    </ul>
                                                                                    <div className="ico-add-popup__btn-block">
                                                                                        <button
                                                                                            className="ico-add-popup__btn-block__btn">
                                                                                            Accept
                                                                                        </button>
                                                                                        <div
                                                                                            className="ico-add-popup__btn-block__btn--cancel"
                                                                                            onClick={this.closeModal}>Cancel
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            ) : null
                                                                        }
                                                                        {
                                                                            contract.step === 2 ? (
                                                                                <form className="ico-add-popup__registration" onSubmit={this.handleSubmitRegistration_4}>
                                                                                    <h3 className="ico-add-popup__registration__title">create ico contract</h3>
                                                                                    <div className="ico-add-popup__registration__subtitle">Sending transaction</div>
                                                                                    {
                                                                                        mode === 'keystore' ? (
                                                                                            <ul className="ico-add-popup__registration__list">
                                                                                                <li className="ico-add-popup__registration__list-item">
                                                                                                    <div className="ico-add-popup__registration__list-item__title">Keystore password:</div>
                                                                                                    <input
                                                                                                        className="ico-add-popup__registration__list-item__input"
                                                                                                        required type="password"
                                                                                                        value={contract.password}
                                                                                                        onChange={this.handleChangeTxParams('contract', 'password')}/>
                                                                                                </li>
                                                                                            </ul>
                                                                                        ) : null
                                                                                    }
                                                                                    <div className="ico-add-popup__btn-block">
                                                                                        <button className="ico-add-popup__btn-block__btn">send tx</button>
                                                                                        <div className="ico-add-popup__btn-block__btn--cancel" onClick={this.handleClickBackPopup('contract', 1)}>Back</div>
                                                                                    </div>
                                                                                </form>
                                                                            ) : null
                                                                        }
                                                                    </div>
                                                                )
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
        id: ownProps.match.params.app_id,
        url: state.node.url,
        gasPrice: state.gasPrice,
        address: state.user.address,
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

export default connect(mapStateToProps, mapDispatchToProps)(IcoAdd)