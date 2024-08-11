import React, { useState, useEffect } from 'react';
import { auth } from '../Configs/FirebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowMessagediv from '../ShowMessage/ShowMessagediv.js';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../../ComponetsStyles/LoginForm.css';
import axios from '../AxiosInterceptor/axiosInterceptor.js';
import CircularProgressButton from '../CircularProgressButton/CircularProgressButton.js';

export default function LoginForm() {

    const [count, setCount] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const [showMessage, setshowMessage] = useState({
        innerText: "",
        className: "",
        role: ""
    });

    let navigate = useNavigate();

    useEffect(() => {
        document.title = 'Welcome to Purbasa Activity Institute';

        if (sessionStorage.getItem("somethingWrong")) {
            sessionStorage.clear();
            setshowMessage({
                innerText: "Something went wrong. Please Log In again.",
                className: "alert alert-danger",
                role: "alert"
            });

        }
        else if (sessionStorage.getItem("Logout")) {
            sessionStorage.clear();
            setshowMessage({
                innerText: "Successfully Logged out.",
                className: "alert alert-danger",
                role: "alert"
            });
        }
    }, []);

    const LoginBtnOnClick = async (e) => {
        e.preventDefault();
        setCount(count => count + 1);

        const email = document.getElementById('EmailTxt').value;
        const password = document.getElementById('PasswordTxt').value;

        if (!email || !password) {
            setshowMessage({
                innerText: "Please Enter User Name and Password to Login.",
                className: "alert alert-danger",
                role: "alert"
            });
            return;
        }

        setLoggingIn(true);

        try {
            const signinResponse = await signInWithEmailAndPassword(auth, email, password);
            await handleLoginSuccess(signinResponse);
        } catch {
            handleLoginError();
        }
    };

    const handleLoginSuccess = async (signinResponse) => {
        try {
            const response = await axios.post(
                process.env.REACT_APP_LOGIN_API_URL,
                { emailId: signinResponse.user.email }
            );
            localStorage.setItem("UserName", response.data.name);
            navigate("/Home");
        } catch {
            handleRequestError();
        }
    };

    const handleLoginError = () => {
        setshowMessage({
            innerText: "Entered User Name or Password is incorrect. Please Try Again.",
            className: "alert alert-danger",
            role: "alert"
        });

        clearPasswordInput();
        setLoggingIn(false);
    };

    const handleRequestError = () => {
        setshowMessage({
            innerText: "Something went wrong.",
            className: "alert alert-danger",
            role: "alert"
        });

        clearPasswordInput();
        setLoggingIn(false);
    };

    const clearPasswordInput = () => {
        document.getElementById('PasswordTxt').value = "";
    };



    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };


    return (
        <>
            <div className="main-menu">
                <img src="https://mindmantraabacus.co.in/cs/logo.png"
                    style={{ width: '185px', margin: "1rem", backgroundColor: "white" }} alt="logo" />
            </div>
            <section className="vh-200">
                <div className="container py-6 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-6">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body text-center">
                                    <h1 id="hText" className="mb-4">Welcome to Purbasa Activity Institute</h1>
                                    <p className="mb-4 pText"><AccountCircleIcon sx={{ fontSize: 70 }} /></p>
                                    <p id="lText" className="mb-2">Please Login to continue</p>
                                    <form onSubmit={LoginBtnOnClick}>
                                        <div className="form-outline mb-4">
                                            <FormControl sx={{ marginTop: '1.5rem', width: '100%' }} variant="outlined">
                                                <InputLabel htmlFor="EmailTxt">Email</InputLabel>
                                                <OutlinedInput
                                                    id="EmailTxt"
                                                    type="text"
                                                    label="Email"
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                                <InputLabel htmlFor="PasswordTxt">Password</InputLabel>
                                                <OutlinedInput
                                                    id="PasswordTxt"
                                                    type={showPassword ? 'text' : 'password'}
                                                    endAdornment={
                                                        <InputAdornment position="start">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="start"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                />
                                            </FormControl>
                                        </div>
                                        <br />
                                        {!loggingIn ?
                                            <Button variant="contained" id="LoginBtn" type="submit">Login</Button>
                                            : <CircularProgressButton Text="Logging In..." id="LoggingInBtn" />
                                        }
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

