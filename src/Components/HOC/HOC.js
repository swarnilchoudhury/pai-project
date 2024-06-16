import React from 'react';
import NavBar from '../NavBar/NavBar.tsx';
import HomePage from '../HomePage/HomePage.js';
import PageNotFound from '../PageNotFound/PageNotFound.jsx';
import RecordsPage from '../RecordsPage/RecordsPage.js';

const HOC = (props) => {

    let userName = localStorage.getItem('UserName');

    const renderContent = () => {

        if (props.pageName === 'HomePage') {
            return <HomePage UserName={userName} />;
        }

        if (props.pageName === 'Records') {
            return <RecordsPage UserName={userName} />;
        }

        return <PageNotFound/>;
    };

    return (
        <>
            <NavBar UserName={userName} />
            {renderContent()}
        </>
    );

}

export default HOC
