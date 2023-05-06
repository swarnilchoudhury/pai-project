import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../FirebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import '../../ComponetsStyles/LoginForm.css'
import ShowMessagediv from '../../Components/ShowMessagediv.js'

export default function LoginForm(props) {

    const emailRef = useRef();
    const passwordRef = useRef();
    const [count, setCount] = useState(0);

    const [showMessage, setshowMessage] = useState({
        innerText: "",
        className: "",
        role: ""
    });

    let navigate = useNavigate();

    useEffect(() => {

        if (props.Message !== null && props.Message) {

            setCount(count => count + 1);

            setshowMessage({
                innerText: "LogOut Successfull.",
                className: "alert alert-danger",
                role: "alert"
            });
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {

            if (localStorage.getItem('AuthToken') !== null
                && user !== null
                && localStorage.getItem('AuthToken') === user.accessToken) {
                    
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

        setCount(count => count + 1);

        let EmailTxt = emailRef.current.value;
        let PasswordTxt = passwordRef.current.value;

        if (EmailTxt == "" || PasswordTxt == "") {

            setshowMessage({
                innerText: "Please Enter User Name and Password to Login.",
                className: "alert alert-danger",
                role: "alert"
            });

        }
        else {

            try {

                let response = await signInWithEmailAndPassword(auth, EmailTxt, PasswordTxt);
                localStorage.setItem('AuthToken', response.user.accessToken);
                navigate('/Home');

            }
            catch {

                setshowMessage({
                    innerText: "Entered User Name or Password is incorrect. Please Try Again.",
                    className: "alert alert-danger",
                    role: "alert"
                });

                passwordRef.current.value = "";
                navigate('/');

            }


        }
    }

    const ClearBtnOnClick = (e) => {

        e.preventDefault();

        setCount(count => count + 1);

        emailRef.current.value = "";
        passwordRef.current.value = "";

        setshowMessage({
            innerText: "",
            className: "",
            role: ""
        });
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
                                    <form onSubmit={LoginBtnOnClick}>
                                        <div className="form-outline mb-4">
                                            <input type="email" id="EmailTxt" ref={emailRef} placeholder='Email' className="form-control form-control-lg" />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input type="password" id="PasswordTxt" ref={passwordRef} placeholder='Password' className="form-control form-control-lg" />
                                        </div>

                                        <button id="LoginBtn" className="btn btn-primary" type="submit">Login</button>
                                        <button id="ClearBtn" className="btn btn-primary" type="reset" onClick={(e) => ClearBtnOnClick(e)}>Clear</button>
                                        <br />
                                        <br />
                                    </form>
                                    <ShowMessagediv key={count} props={showMessage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

