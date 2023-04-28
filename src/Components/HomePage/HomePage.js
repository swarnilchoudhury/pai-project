import React, { useState, useEffect } from 'react';
import { auth } from '../../Components/FirebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar.js';

const HomePage = () => {

    const [user, setUser] = useState(null);
    const [IsUser, setIsUser] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        
        const unsubscribe = auth.onAuthStateChanged((user) => {

            if (sessionStorage.getItem('AuthToken') === null
                || user === null) {
                           
                navigate('/');

            }
            else {

                setUser(user);
                setIsUser(true);
            }
        });

        return () => {
            unsubscribe();
        }

    }, []);

  return (
    <>
    {IsUser && <div>
        <NavBar UserName={user}/>
      </div>}
      </>
    
  )
}

export default HomePage
