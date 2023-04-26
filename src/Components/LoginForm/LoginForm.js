import React, { useState, useEffect } from 'react';
import { auth } from '../FirebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import '../../ComponetsStyles/LoginForm.css'
import ShowMessagediv from '../../Components/ShowMessagediv.js'

export default function LoginForm() {

    const [EmailTxt, setEmailTxt] = useState("");
    const [PasswordTxt, setPasswordTxt] = useState("");
    const [user, setUser] = useState(null);

    const [showMessage, setshowMessage] = useState({
        innerText: "",
        className: "",
        role: ""
    });

    let navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((user) => {

            if (sessionStorage.getItem('AuthToken') !== null
                && user !== null
                && sessionStorage.getItem('AuthToken') === user.accessToken) {

                setUser(user);
                navigate('/Home');

            }
            else {
                navigate('/');
            }
        });

        return () => {
            unsubscribe();
        }

    }, []);


    const LoginBtnOnClick = async (e) => {

        e.preventDefault();
        let showMessage = document.getElementById("showMessage");

        if (EmailTxt == "" || PasswordTxt == "") {

            // setshowMessage({
            //     innerText: "Please Enter User Name and Password to Login.",
            //     className: "alert alert-danger",
            //     role: "alert"
            // });

            showMessage.innerText = "Please Enter User Name and Password to Login.";
            showMessage.className = "alert alert-danger";
            showMessage.role = "alert";
        }
        else {

            try {

                let response = await signInWithEmailAndPassword(auth, EmailTxt, PasswordTxt);
                sessionStorage.setItem('AuthToken', response.user.accessToken);
                navigate('/Home');

            }
            catch {
                showMessage.innerText = "Entered User Name or Password is incorrect. Please Try Again";
                showMessage.className = "alert alert-danger";
                showMessage.role = "alert";

                setEmailTxt('');
                setPasswordTxt('');
                navigate('/');

            }


        }
    }

    const ClearBtnOnClick = (e) => {
        e.preventDefault();

        let showMessage = document.getElementById("showMessage");

        setEmailTxt('');
        setPasswordTxt('');

        showMessage.innerText = "";
        showMessage.className = "";
        showMessage.role = "";
    }


    return (
        <>
            <section className="vh-200">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <h1 id="hText" className="mb-4">Welcome to PAI</h1>
                                    <p className="mb-4 pText">Please Log In to continue</p>

                                    <div className="form-outline mb-4">
                                        <input type="email" id="EmailTxt" value={EmailTxt} placeholder='Email' className="form-control form-control-lg" onChange={(e) => setEmailTxt(e.target.value)} />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input type="password" id="PasswordTxt" value={PasswordTxt} placeholder='Password' className="form-control form-control-lg" onChange={(e) => setPasswordTxt(e.target.value)} />
                                    </div>

                                    <button id="LoginBtn" className="btn btn-primary" type="submit" onClick={(e) => LoginBtnOnClick(e)}>Login</button>
                                    <button id="ClearBtn" className="btn btn-primary" type="reset" onClick={(e) => ClearBtnOnClick(e)}>Clear</button>
                                    <br />
                                    <br />                                                                            
                                     {/* <ShowMessagediv props={showMessage} /> */}
                                    <div id="showMessage"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

