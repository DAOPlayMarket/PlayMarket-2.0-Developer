import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {Helmet} from "react-helmet";

// import EnsureLoggedIn from './container/EnsureLoggedIn'
// import Main from './container/Main'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Preloader from './components/Preloader'

// import Home from './pages/Home'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Post from './pages/Post'
import Apps from './pages/Apps'
import App from './pages/App'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'

function PrivateRoute ({component: Component, isAuth, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => isAuth === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/auth', state: {from: props.location}}} />}
        />
    )
}

function AuthRoute ({component: Component, isAuth, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => isAuth === true
                ? <Redirect to={{pathname: '/', state: {from: props.location}}} />
                : <Component {...props} />}
        />
    )
}

class _App extends Component {
    render() {
        let { isAuth } = this.props;
        return (
            <BrowserRouter>
                <div className="App">
                    <Helmet>
                        <title>Play Market 2.0 Developer Module</title>
                    </Helmet>
                    {/*<Header />*/}
                    {/*<div id="wrapper">*/}
                    {/*<Sidebar/>*/}
                    {/*<div id="content">*/}
                    <Switch>
                        <AuthRoute isAuth={isAuth} path='/auth' component={Auth} />
                        <PrivateRoute isAuth={isAuth} exact path='/' component={Apps} />
                        <PrivateRoute isAuth={isAuth} path='/apps' component={Apps} />
                        {/*<Route path='/apps' component={Apps} />*/}
                        <PrivateRoute isAuth={isAuth} path='/app/:app_id' component={App} />
                        <Route path="*" component={NotFound} />
                    </Switch>
                    {/*</div>*/}
                    {/*</div>*/}
                    <Preloader/>
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
