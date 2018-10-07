import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";


import { startLoading, endLoading } from '../actions/preloader'

import Notification from '../components/Notification';

class Apps extends Component {
    state = {
        apps: [],
        loadedApps: [],
        // notLoadedApps: []
    };

    async componentDidMount(){
        await this.getApps();
    }

    getApps = async () => {
        let { address, url } = this.props;
        this.props.startLoading();
        try {
            let response = (await axios({
                method: 'post',
                url: `${url}/api/get-apps-by-developer`,
                data: {
                    address: address
                }
            })).data;
            let apps = response.result;

            // console.log('apps:', apps);
            let loadedApps = apps.filter(app => !!app.hash);
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
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
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
        let { loadedApps } = this.state;
        let { url } = this.props;

        return (
            <div className="apps-page">
                <Helmet>
                    <title>Apps | Play Market 2.0 Developer Module</title>
                </Helmet>
                {/*<Link to="ico-add/1">CLICK ME</Link>*/}
                <div className="apps-page__header">
                    <div className="apps-page__header--left">
                        <div className="apps-page__header__title">Your applications</div>
                        <div className="apps-page__header__refresh" onClick={this.handleClickRefresh}></div>
                    </div>
                    <div className="apps-page__header--right">
                        <Link className="apps-page__header__add" to='/app-add' title="Add new application"></Link>
                    </div>
                </div>
                <div className="apps-page__body">
                    {
                        loadedApps.length ? (
                            <ul className="apps-page__body__list">
                                {
                                    loadedApps.map((app, index) => {
                                        return (
                                            <li className="apps-page__body__list-item" key={app.idApp}>
                                                <ul className="apps-page__body__list-item__head">
                                                    <li className="apps-page__body__list-item__head-item" data-section="logo"></li>
                                                    <li className="apps-page__body__list-item__head-item" data-section="name">name</li>
                                                    <li className="apps-page__body__list-item__head-item" data-section="status">status</li>
                                                    <li className="apps-page__body__list-item__head-item" data-section="more"></li>
                                                </ul>
                                                <ul className="apps-page__body__list-item__main">
                                                    <li className="apps-page__body__list-item__main-item" data-section="logo">
                                                        <img src={`${url}/data/${app.hashType}/${app.hash}/${app.files.images.logo}`} alt="LOGO"/>
                                                    </li>
                                                    <li className="apps-page__body__list-item__main-item" data-section="name">
                                                        {app.nameApp.length ? app.nameApp : <span>Not specified</span>}
                                                    </li>
                                                    <li className="apps-page__body__list-item__main-item" data-section="status">
                                                        <span className={app.publish ? 'active' : null}>{app.publish ? 'ACTIVE' : 'NOT ACTIVE'}</span>
                                                    </li>
                                                    <li className="apps-page__body__list-item__main-item" data-section="more">
                                                        <button onClick={this.handleClickToggleExtend(index)} title="More"></button>
                                                    </li>
                                                </ul>
                                                <div className={'apps-page__body__list-item__dropdown ' + (app.SERVICE.isExtend ? 'visible' : '')}>
                                                    <ul className="apps-page__body__list-item__dropdown__table">
                                                       <li className="apps-page__body__list-item__dropdown__table-item">
                                                           <div className="apps-page__body__list-item__dropdown__table-item__title">publish</div>
                                                           <div className="apps-page__body__list-item__dropdown__table-item__value">
                                                               {app.publish ? 'YES' : 'NO'}
                                                           </div>
                                                       </li>
                                                        <li className="apps-page__body__list-item__dropdown__table-item">
                                                            <div className="apps-page__body__list-item__dropdown__table-item__title">confirmation</div>
                                                            <div className="apps-page__body__list-item__dropdown__table-item__value">
                                                                {app.confirmation ? 'YES' : 'NO'}
                                                            </div>
                                                        </li>
                                                        <li className="apps-page__body__list-item__dropdown__table-item">
                                                            <div className="apps-page__body__list-item__dropdown__table-item__title">price</div>
                                                            <div className="apps-page__body__list-item__dropdown__table-item__value">
                                                                {parseInt(app.price, 10) / 100}
                                                            </div>
                                                        </li>
                                                        {/*<li className="apps-page__body__list-item__dropdown__table-item">*/}
                                                            {/*<div className="apps-page__body__list-item__dropdown__table-item__title">ico</div>*/}
                                                            {/*<div className="apps-page__body__list-item__dropdown__table-item__value">*/}
                                                                {/*{app.icoRelease ? 'YES' : 'NO'}*/}
                                                            {/*</div>*/}
                                                        {/*</li>*/}
                                                    </ul>
                                                    <ul className="apps-page__body__list-item__dropdown__links">
                                                        <li className="apps-page__body__list-item__dropdown__links-item">
                                                            <Link to={`/app/${app.idApp}`}>app</Link>
                                                        </li>
                                                        {
                                                            !app.icoRelease ? (
                                                                <li className="apps-page__body__list-item__dropdown__links-item">
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
                        ) : null
                    }
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        address: state.user.address,
        url: state.node.url
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Apps)