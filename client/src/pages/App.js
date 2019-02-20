import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import {Helmet} from "react-helmet";

import ReactMarkdown from 'react-markdown'

import { startLoading, endLoading } from '../actions/preloader'
import Notification from '../components/Notification';
import Gallery from '../components/Gallery';

class App extends Component {
    state = {
        type: '',
        category: '',
        app: null
    };

    async componentDidMount(){
        let idApp = this.props.id;
        let { url, categories } = this.props;
        await this.props.startLoading();
        try {
            let response = (await axios({
                method: 'post',
                url: `${url}/api/get-app-for-developer`,
                data: {
                    idApp: idApp
                }
            })).data;
            let type = categories.find(item => item.id === parseInt(response.result.idCTG, 10));
            let category = type.subcategories.find(item => item.id === parseInt(response.result.subCategory, 10));
            this.setState({
                app: response.result,
                type: type,
                category: category
            });
            await this.props.endLoading();
        } catch (err) {
            await this.props.endLoading();
            console.error(err);
            Notification('error', err.message);
        }
    }

    render(){
        let { app, type, category } = this.state;
        let { url } = this.props;

        return (
            <div>
                {app ? (
                        <div className="app">
                            <Helmet>
                                <title>{app.nameApp} | Play Market 2.0 Developer Module</title>
                            </Helmet>
                            {/*{!app.icoRelease ? (*/}
                                {/*<div className="app-menu">*/}
                                    {/*<Link to={{pathname: '/ico-add', state: { app: app }}}>START ICO</Link>*/}
                                {/*</div>*/}
                            {/*) : null}*/}

                            <div className="app-main">
                                <div className="app-main--left">
                                    <div className="app-main__logo">
                                        <img src={`${url}/data/${app.hashType}/${app.hash}/${app.files.images.logo}`} alt={app.nameApp}/>
                                    </div>
                                    <div className="app-main__type">
                                        <div className="app-main__type--title">Type:</div>
                                        <div className="app-main__type--value">{type.name}</div>
                                    </div>
                                    <div className="app-main__category">
                                        <div className="app-main__category--title">Category:</div>
                                        <div className="app-main__category--value">{category.name}</div>
                                    </div>
                                    {app.forChildren || app.advertising ? (
                                        <ul className="app-main__marks">
                                            {app.forChildren ? (<li className="app-main__marks--item">For children</li>) : null}
                                            {app.advertising ? (<li className="app-main__marks--item">Has advertising</li>) : null}
                                        </ul>
                                    ) : null}
                                </div>
                                <div className="app-main--right">
                                    <div className="app-main__name">{app.nameApp}</div>
                                    <div className="app-main__slogan">{app.slogan}</div>
                                    <div className="app-main__shortDescr">{app.shortDescr}</div>
                                    <ReactMarkdown className="app-main__longDescr" source={app.longDescr} />
                                </div>
                            </div>
                            <div className="app-gallery">
                                <Gallery path={`${url}/data/${app.hashType}/${app.hash}`} images={app.files.images.gallery}/>
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