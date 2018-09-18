import React from 'react';
import { Route, Redirect } from 'react-router-dom'

// Layouts
import DashboardLayout from '../layout/dashboard'
import AuthLayout from '../layout/auth'
import ErrorLayout from '../layout/error'

export const AuthRoute = ({component: Component, isAuth, ...rest}) => {
    return (
        <Route {...rest} render={(props) => isAuth === true
            ? <Redirect to={{pathname: '/apps', state: {from: props.location}}} />
            : <AuthLayout>
                <Component {...props} />
            </AuthLayout>}
        />
    )
};
export const DashboardRoute = ({component: Component, isAuth, ...rest}) => {
    return (
        <Route {...rest} render={(props) => isAuth === true
            ? (
                <DashboardLayout>
                    <Component {...props} />
                </DashboardLayout>
            ) : <Redirect to={{pathname: '/auth', state: {from: props.location}}} />}
        />
    )
};
export const ErrorRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={matchProps => (
            <ErrorLayout>
                <Component {...matchProps} />
            </ErrorLayout>
        )} />
    )
};
