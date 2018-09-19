import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import {Helmet} from "react-helmet";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {AuthRoute, DashboardRoute, ErrorRoute} from './routes'

import Preloader from './components/Preloader'

import Apps from './pages/Apps'
import App from './pages/App'
import AppAdd from './pages/AppAdd'
import Auth from './pages/Auth'
import IcoAdd from './pages/IcoAdd'
import NotFound from './pages/NotFound'

class _App extends Component {
    render() {
        let { isAuth } = this.props;

        // window.onbeforeunload = () => {
        //     return "Are you sure you want to refresh? You will lost the current session.";
        // };

        return (
          <BrowserRouter>
            <div className="App">
              <Helmet>
                <title>Play Market 2.0 Developer Module</title>
              </Helmet>
              <Switch>
                <AuthRoute isAuth={isAuth} path='/auth' component={Auth} />
                <DashboardRoute isAuth={isAuth} exact path='/' component={Apps} />
                <DashboardRoute isAuth={isAuth} path='/apps' component={Apps} />
                <DashboardRoute isAuth={isAuth} path='/app/:app_id' component={App} />
                <DashboardRoute isAuth={isAuth} path='/app-add' component={AppAdd} />
                <DashboardRoute isAuth={isAuth} path='/ico-add' component={IcoAdd} />
                <ErrorRoute path="*" component={NotFound} />
              </Switch>
              <Preloader/>
              <ToastContainer/>
            </div>
          </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.isAuth
    }
};

export default connect(mapStateToProps)(_App)
