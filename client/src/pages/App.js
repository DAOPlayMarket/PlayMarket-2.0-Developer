import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import $ from "jquery";
import axios from 'axios';
import {Helmet} from "react-helmet";

import ReactMarkdown from 'react-markdown'

import { startLoading, endLoading } from '../actions/preloader'
import Notification from '../components/Notification';
import Gallery from '../components/Gallery';

class App extends Component {
    state = {
        app: null
    };

    async componentDidMount(){
        let idApp = this.props.id;
        let { url } = this.props;
        await this.props.startLoading();
        try {
            let response = (await axios({
                method: 'post',
                url: url + '/api/get-app-for-developer',
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

    // getType = () => {
    //     let { idCTG } = this.state.app.idCTG;
    //     let categories = this.props.categories;
    //     let type = (categories.find(item => item.id === idCTG)).name;
    //     // await this.setState(this.getInitialState());
    // };

    render(){
        let { app } = this.state;
        let { url } = this.props;

        // let categories = this.props.categories;
        // let type = (categories.find(item => item.id === app.idCTG)).name;
        // let type = this.props.categories;

        return (
            <div>
                {app ? (
                        <div className="app">
                            <Helmet>
                                <title>{app.nameApp} | Play Market 2.0 Developer Module</title>
                            </Helmet>
                            <div className="app-main">
                                <div className="app-main--left">
                                    <div className="app-main__logo">
                                        <img src={url + '/data/' + app.hashTag + '/' + app.hash + '/'+ app.files.images.logo} alt={app.nameApp}/>
                                    </div>
                                    <div className="app-main__type">
                                        <div className="app-main__type--title">Type:</div>
                                        <div className="app-main__type--value">{app.idCTG}</div>
                                    </div>
                                    <div className="app-main__category">
                                        <div className="app-main__category--title">Category:</div>
                                        <div className="app-main__category--value">{app.subCategory}</div>
                                    </div>
                                    {app.forChildren || app.advertising ? (
                                        <ul className="app-main__marks">
                                            {app.forChildren ? (<li className="app-main__marks--item">For children</li>) : null}
                                            {app.advertising ? (<li className="app-main__marks--item">Has advertising</li>) : null}
                                        </ul>
                                    ) : null}
                                </div>
                                <div className="app-main--right">
                                    <div>{app.nameApp}</div>
                                    <div>{app.slogan}</div>
                                    <div>{app.shortDescr}</div>
                                    <div>
                                        <ReactMarkdown className="markdown" source={app.longDescr} />
                                    </div>
                                </div>
                            </div>
                            <div className="app-gallery">
                                {/*<Gallery path={url + '/data/' + app.hashTag + '/' + app.hash} images={app.files.images.gallery}/>*/}
                            </div>
                            <div className="app-info">

                            </div>
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
        categories: state.categories
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App)