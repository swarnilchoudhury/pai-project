import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Components/FirebaseConfig.js';
import NavBar from '../NavBar.js';
import CreateForm from './CreateForm.js';

const HomePage = () => {

    const [userName, setUserName] = useState("");
    const [IsUser, setIsUser] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged(async (user) => {

            if (localStorage.getItem('AuthToken') === null
                || user === null) {

                navigate('/');

            }
            else {
                setIsUser(true);

                let userNameResponse = doc(db, 'UserName', user.email);
                let userNameDocResponse = await getDoc(userNameResponse);
                if (userNameDocResponse.exists()) {
                    setUserName(userNameDocResponse.data().Name);
                }
            }
        });

        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <>
            {IsUser && <div>
                <NavBar UserName={userName} />
                <CreateForm UserName={userName}/>
            </div>}
        </>

    )
}

export default HomePage
