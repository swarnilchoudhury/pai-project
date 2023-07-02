import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Components/FirebaseConfig.js';
import Spinner from '../Spinner.js';
import NavBar from '../NavBar.tsx';
import CreateForm from './CreateForm.js';
import SearchPage from '../SearchPage/SearchPage.js';


const HomePage = (props) => {

    const [userName, setUserName] = useState("");
    const [IsPageLoads, setIsPageLoads] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(async (user) => {

            if (localStorage.getItem('AuthToken') === null
                || user === null
                || localStorage.getItem('AuthToken') !== user.accessToken) {

                navigate('/');

            }
            else {

                let userNameResponse = doc(db, 'UserName', user.email);
                let userNameDocResponse = await getDoc(userNameResponse);
                if (userNameDocResponse.exists()) {
                    setUserName(userNameDocResponse.data().Name);
                    setIsPageLoads(true);
                }
            }
        });

        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <div>
            <NavBar UserName={userName} />
            {!IsPageLoads ? (
                <>
                    <div className='spinnerDiv'>
                        <Spinner/>
                    </div>
                </>
            ) : (
                (props.pageName === 'Create' && <CreateForm UserName={userName} /> ) ||
                (props.pageName === 'Search' && <SearchPage UserName={userName} /> )
            )}
        </div>
    );
}

export default HomePage
