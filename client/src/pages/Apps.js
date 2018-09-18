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
        notLoadedApps: []
    };

    async componentDidMount(){
        let { address, url } = this.props;
        this.props.startLoading();
        try {
            let response = (await axios({
                method: 'post',
                url: url + '/api/get-apps-by-developer',
                data: {
                    address: address
                }
            })).data;
            let apps = response.result;
            let loadedApps = apps.filter(app => app.loadFile === true);
            let notLoadedApps = apps.filter(app => app.loadFile === false);
            await this.setState({
                apps: apps,
                loadedApps: loadedApps,
                notLoadedApps: notLoadedApps
            });
            this.props.endLoading();
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    }

    render(){
        let { loadedApps, notLoadedApps } = this.state;
        let { url } = this.props;

        const apps1 = loadedApps.length ? (
            <div className="apps">
                <div className="apps__title">Your applications</div>
                <ul className="apps__header">
                    <li className="apps__header--col" data-col="name">name</li>
                    <li className="apps__header--col" data-col="publish">publish</li>
                    <li className="apps__header--col" data-col="confirmation">confirmation</li>
                    <li className="apps__header--col" data-col="price">price</li>
                    <li className="apps__header--col" data-col="ico">ico</li>
                </ul>
                <ul className="apps__list">
                    {loadedApps.map(app => {
                        return (
                            <li className="apps__list--item" key={app.idApp}>
                                <Link to={'/app/' + app.idApp}>
                                    <div className="apps__list--item__col" data-col="name">
                                        <img src={url + '/data/' + app.hashTag + '/' + app.hash + '/' + app.files.images.logo} alt=""/>
                                        {app.nameApp}
                                    </div>
                                    <div className="apps__list--item__col" data-col="publish">
                                        {app.publish ? 'YES' : 'NO'}
                                    </div>
                                    <div className="apps__list--item__col" data-col="confirmation">YES</div>
                                    <div className="apps__list--item__col" data-col="price">
                                        {app.price}
                                    </div>
                                    <div className="apps__list--item__col" data-col="ico">
                                        {app.icoRelease ? 'YES' : 'NO'}
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        ) : (
            <div className="apps">
                <div className="apps__placeholder">You don't have downloaded apps</div>
            </div>
        );

        const apps2 = notLoadedApps.length ? (
            <div className="apps-loading">
                <div className="apps-loading__title">Applications now loading on node</div>
                <ul className="apps-loading__list">
                    {notLoadedApps.map(app => {
                        return (
                            <li className="apps-loading__list--item" key={app.idApp}>
                                <div className="apps-loading__list--item__col" data-col="hashTag">{app.hashTag}</div>
                                <div className="apps-loading__list--item__col" data-col="hash">{app.hash}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        ) : null;


        return (
            <div className="apps-page">
                <Helmet>
                    <title>Apps | Play Market 2.0 Developer Module</title>
                </Helmet>
                <div className="apps-page__add">
                    <Link to='/app-add' title="Add new application"></Link>
                </div>
                {apps1}
                {apps2}
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