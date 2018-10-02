import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios';
import {Helmet} from "react-helmet";
import $ from "jquery";
import moment from 'moment';
import TextareaAutosize from 'react-textarea-autosize';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css'

import { startLoading, endLoading } from '../actions/preloader'

// import { getWallet, getSignedTransaction, sendSignedTransaction, getTransactionStatus } from '../utils/web3'

import Notification from '../components/Notification';

// moment.tz.setDefault('UTC');

class IcoAdd extends Component {
    state = {
        app: null,
        SERVICE: {
            gallery: [],
            logo: null,
            banner: null,
            keyword: '',
            minDate: moment().add(1, 'day').startOf('day'),
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
                            git: ''
                        }
                    },
                    advisor: {

                    }
                },
                team: [],
                advisors: [],
            }
        },
        settings: {
            tokenName: '',
            tokenSymbol: '',
            startDate: moment().add(1, 'day').startOf('day'),
            hardCapUSD: ''
        },
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
        // console.log(moment.utc().add(1, 'day').startOf('day').toDate());

        let idApp = this.props.id;
        let { url } = this.props;
        await this.props.startLoading();
        try {
            let response = (await axios({
                method: 'post',
                url: `${url}/api/get-app-for-developer`,
                data: {
                    idApp: idApp
                }
            })).data;
            this.setState({
                app: response.result
            });
            await this.props.endLoading();
        } catch (err) {
            await this.props.endLoading();
            Notification('error', err.message);
        }
    }

    // handleChangeLogo = async e => {
    //     e.persist();
    //     let file = e.target.files.length ? e.target.files[0] : null;
    //     if (file) {
    //         if (file.type.includes('image')) {
    //             let reader = new FileReader();
    //             reader.onload = async () => {
    //                 await this.setState({
    //                     ico: {...this.state.ico, files: {...this.state.ico.files, logo: file}},
    //                     service: {...this.state.service, logo: {imageBase64: reader.result, name: file.name}}
    //                 });
    //             };
    //             reader.readAsDataURL(file);
    //         } else {
    //             await this.setState({
    //                 ico: {...this.state.ico, files: {...this.state.ico.files, logo: null}},
    //                 service: {...this.state.service, logo: null}
    //             });
    //             Notification('error', 'Invalid image file');
    //         }
    //     } else {
    //         await this.setState({
    //             ico: {...this.state.ico, files: {...this.state.ico.files, logo: null}},
    //             service: {...this.state.service, logo: null}
    //         });
    //     }
    // };

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
                            name: members.temp[param].name,
                            photo: members.temp[param].photo,
                            description: members.temp[param].description,
                            social: members.temp[param].social,
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
                                git: ''
                            }
                        }
                    }
                }
            }
        });
        $('#' + [param] + '_logo').val('');
    };

    handleSubmitUpload = async e => {
        e.preventDefault();
    };

    render(){
        let { app } = this.state;

        let { minDate, members } = this.state.SERVICE;
        // let { gallery, logo, banner, keyword } = this.state.SERVICE;
        let { tokenName, tokenSymbol, startDate, hardCapUSD } = this.state.settings;

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
                                        {/*<div className="app-add__section-1__logo">*/}
                                        {/*{logo ? (<img src={logo.imageBase64} alt="PREVIEW"/>) : null}*/}
                                        {/*<div className={"app-add__section-1__logo__placeholder " + (logo ? '' : 'visible')}>no image available</div>*/}
                                        {/*<input type="file" name="logo" accept=".png, .jpg, .jpeg" onChange={this.handleChangeLogo}/>*/}
                                        {/*</div>*/}
                                    </div>
                                </section>
                                <section className="ico-add__section ico-add__section-2">
                                    <div className="ico-add__section__title">ICO information</div>
                                    <div className="ico-add__section-2__content">
                                        <div className="ico-add__section-2__content__box">
                                            <div className="ico-add__section-2__content__box__title">members</div>
                                            <div className="ico-add__section-2__content__box__members">
                                                <ul className="ico-add__section-2__content__box__members__list">
                                                    <li className="ico-add__section-2__content__box__members__list-item">

                                                    </li>
                                                </ul>
                                                <div className="ico-add__section-2__content__box__members__add">
                                                    <div className="ico-add__section-2__content__box__members__add__main">
                                                        <div className="ico-add__section-2__content__box__members__add__main__photo">
                                                            {members.temp.team.photoPreview ? (<img src={members.temp.team.photoPreview.imageBase64} alt="PREVIEW"/>) : null}
                                                            {/*<div className={"app-add__section-1__logo__placeholder " + (logo ? '' : 'visible')}>no image available</div>*/}
                                                            <input id="team_logo" type="file" accept=".png, .jpg, .jpeg" onChange={this.handleChangeMemberPhoto('team')}/>
                                                        </div>
                                                        <div className="ico-add__section-2__content__box__members__add__main__description">
                                                            <div className="ico-add__section-2__content__box__members__add__main__description__name">
                                                                <input type="text" value={members.temp.team.name} onChange={this.handleChangeMemberName('team')}/>
                                                            </div>
                                                            <TextareaAutosize className="ico-add__section-2__content__box__members__add__main__description__text" placeholder="Very big member" minRows={1} name='description' value={members.temp.team.description} onChange={this.handleChangeMemberDescription('team')}/>
                                                        </div>
                                                    </div>
                                                    <ul className="ico-add__section-2__content__box__members__add__social">
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">Google+</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="googlePlus" value={members.temp.team.social.googlePlus} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">Facebook</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="facebook" value={members.temp.team.social.facebook} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">LinkedIn</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="linkedin" value={members.temp.team.social.linkedin} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">Instagram</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="instagram" value={members.temp.team.social.instagram} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">vk</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="vk" value={members.temp.team.social.vk} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">youtube</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="youtube" value={members.temp.team.social.youtube} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">telegram</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="telegram" value={members.temp.team.social.telegram} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                        <li className="ico-add__section-2__content__box__members__add__social-item">
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__title">git</div>
                                                            <div className="ico-add__section-2__content__box__members__add__social-item__input">
                                                                <input type="text" name="git" value={members.temp.team.social.git} onChange={this.handleChangeMemberSocial('team')}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div className="ico-add__section-2__content__box__members__add__btn-block">
                                                        <button className="ico-add__section-2__content__box__members__add__btn-block__btn" onClick={this.handleSubmitAddMember('team')}>Add team member</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <div className="ico-add__load-block">
                                    <button className="app-add__load-block__btn">Upload</button>
                                </div>
                            </form>
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
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IcoAdd)