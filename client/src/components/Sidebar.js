import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom'

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <Link to="/apps" className="sidebar__header">
                <div className="sidebar__header--logo"></div>
                <div className="sidebar__header--text">playmarket<span>Dev module</span></div>
            </Link>
            <ul className="sidebar__nav">
                <li className="sidebar__nav--item">
                    <NavLink to='/apps' className="sidebar__nav--item__link" data-nav="apps">My apps</NavLink>
                </li>
            </ul>
        </aside>
    )
};

export default withRouter(Sidebar)