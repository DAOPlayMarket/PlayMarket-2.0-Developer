import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import {Helmet} from "react-helmet";
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import geolib from 'geolib';

import 'react-toastify/dist/ReactToastify.min.css';
import 'font-awesome/css/font-awesome.css'

import { AuthRoute, DashboardRoute, ErrorRoute } from './routes'

import { startLoading, endLoading } from './actions/preloader'
import { setNodes, setNode } from './actions/node'
import { setUserPosition } from './actions/user'

import Notification from './components/Notification';

import Preloader from './components/Preloader'
import Control from './components/Control'

import Apps from './pages/Apps'
import App from './pages/App'
import AppUpdateAPK from './pages/AppUpdateAPK'
import AppAdd from './pages/AppAdd'
import Auth from './pages/Auth'
import IcoAdd from './pages/IcoAdd'
import NotFound from './pages/NotFound'

class _App extends Component {
    async componentDidMount(){
        this.props.startLoading();
        try {
            let nodes = await this.getNodes();
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        await this.props.setUserPosition({
                            lat: position.coords.latitude,
                            long: position.coords.longitude
                        });
                        nodes.map(node => {
                            node.distance = geolib.getDistance(
                                {latitude: position.coords.latitude, longitude: position.coords.longitude},
                                {latitude: node.lat, longitude: node.long}
                            );
                        });
                        nodes.sort((a, b) => {return a.distance - b.distance});
                        await this.props.setNodes({
                            nodes: nodes
                        });
                        for (let node of nodes) {
                            let isActive = await this.pingNode('https://' + node.domain);
                            if (isActive) {
                                await this.props.setNode({
                                    url: 'https://' + node.domain,
                                    domain: node.domain,
                                    lat: node.lat,
                                    long: node.long,
                                    ip: node.ip
                                });
                                break;
                            }
                        }
                        this.props.endLoading();
                    },
                    async (err) => {
                        await this.props.setNodes({
                            nodes: nodes
                        });
                        for (let node of nodes) {
                            let isActive = await this.pingNode('https://' + node.domain);
                            if (isActive) {
                                await this.props.setNode({
                                    url: 'https://' + node.domain,
                                    domain: node.domain,
                                    lat: node.lat,
                                    long: node.long,
                                    ip: node.ip
                                });
                                break;
                            }
                        }
                        this.props.endLoading();
                        Notification('warn', err.message);
                    }
                );
            } else {
                await this.props.setNodes({
                    nodes: nodes
                });
                for (let node of nodes) {
                    try {
                        let isActive = await this.pingNode('https://' + node.domain);
                        if (isActive) {
                            await this.props.setNode({
                                url: 'https://' + node.domain,
                                domain: node.domain,
                                lat: node.lat,
                                long: node.long,
                                ip: node.ip
                            });
                            break;
                        }
                    } catch (err) {
                        console.log('error:', err.message);
                    }
                }
                this.props.endLoading();
                Notification('warn', 'Geolocation is not supported by this browser.');
            }
        } catch (err) {
            this.props.endLoading();
            Notification('error', err.message);
        }
    }

    getNodes = async () => {
        try {
            let response = (await axios({
                method: 'get',
                url: '/api/get-nodes'
            })).data;
            if (response.status === 200) {
                return response.result;
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            throw err;
        }
    };

    pingNode = async (domain) => {
        try {
            let response = (await axios({
                method: 'get',
                url: domain + '/api/ping'
            }));
            return response.status === 200
        } catch (err) {
            return false
        }
    };

    render() {
        let { isAuth } = this.props;

        // window.onbeforeunload = () => {
        //     return "Are you sure you want to refresh? You will lost the current session.";
        // };

        return (
          <BrowserRouter>
            <div>
              <Helmet>
                <title>Play Market 2.0 Developer Module</title>
              </Helmet>
              <Switch>
                <AuthRoute isAuth={isAuth} path='/auth' component={Auth} />
                <DashboardRoute isAuth={isAuth} exact path='/' component={Apps} />
                <DashboardRoute isAuth={isAuth} path='/apps' component={Apps} />
                <DashboardRoute isAuth={isAuth} path='/app/:app_id' component={App} />
                <DashboardRoute isAuth={isAuth} path='/update-apk/:app_id/' component={AppUpdateAPK} />
                <DashboardRoute isAuth={isAuth} path='/app-add' component={AppAdd} />
                <DashboardRoute isAuth={isAuth} path='/ico-add/:app_id' component={IcoAdd} />
                <ErrorRoute path="*" component={NotFound} />
              </Switch>
                <Control/>
                <Preloader/>
                <ToastContainer/>
            </div>
          </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.isAuth,
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startLoading: () => dispatch(startLoading()),
        endLoading: () => dispatch(endLoading()),
        setNodes: (payload) => dispatch(setNodes(payload)),
        setNode: (payload) => dispatch(setNode(payload)),
        setUserPosition: (payload) => dispatch(setUserPosition(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(_App)
