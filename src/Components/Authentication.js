import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig.js';
import Spinner from './Spinner.js';
import NavBar from './NavBar.tsx';
import SearchPage from './SearchPage/SearchPage.js';
import HomePage from './HomePage/HomePage.js';
import PageNotFound from './PageNotFound.jsx';

const Authentication = (props) => {

    const [IsPageLoads, setIsPageLoads] = useState(false);

    let navigate = useNavigate();

    let userName = localStorage.getItem('UserName');

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(async (user) => {

            if (localStorage.getItem('AuthToken') === null
                || user === null
                || localStorage.getItem('AuthToken') !== user.accessToken) {

                navigate('/');

            }
            else {

                if (userName === null
                    || userName === '') {

                    let userNameResponse = doc(db, 'UserName', user.email);
                    let userNameDocResponse = await getDoc(userNameResponse);
                    if (userNameDocResponse.exists()) {

                        localStorage.setItem('UserName', userNameDocResponse.data().Name);

                    }

                }
             
                setIsPageLoads(true);
            }
        });

        return () => {
            
            unsubscribe();
        }

    }, []);

    const renderContent = () => {

        if (!IsPageLoads) {
            return (
                <div className='spinnerDiv'>
                    <Spinner />
                </div>
            );
        }

        if (IsPageLoads && props.pageName === 'HomePage') {
            return <HomePage UserName={userName} />;
        }

        if (IsPageLoads && props.pageName === 'Search') {
            return <SearchPage UserName={userName} />;
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

export default Authentication
