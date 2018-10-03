import React from 'react';
import { Link, withRouter } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="not-found-page">
            <h1><span>404</span> page not found</h1>
            <p>We are sorry but the page you are looking for does not exist.</p>
            <div className="not-found-page__link">
                <Link to="/">Home</Link>
            </div>
        </div>
    )
};

export default withRouter(NotFound)