import React from 'react';

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({children}) => {
    return (
        <div id="layout--dashboard">
            <Header />
            <div id="wrapper">
                <Sidebar/>
                <div id="content">
                    {children}
                </div>
            </div>
        </div>
    )
};

export default DashboardLayout
