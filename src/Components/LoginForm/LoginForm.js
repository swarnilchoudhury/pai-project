import React, { useState, useEffect } from 'react';
import { auth } from '../../Configs/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowMessagediv from '../ShowMessage/ShowMessagediv';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../../ComponetsStyles/LoginForm.css';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import CircularProgressButton from '../CircularProgressButton/CircularProgressButton';
import { usePermissions } from '../../Context/PermissionContext';

const LoginForm = () => {

    const [count, setCount] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const [showMessage, setShowMessage] = useState({
        innerText: "",
        className: "",
        role: ""
    });

    const { setUserName } = usePermissions();

    // Render first time when LoginForm mounts
    useEffect(() => {
        document.title = 'Welcome to Purbasa Activity Institute';

        if (sessionStorage.getItem("somethingWrong")) {
            sessionStorage.clear();
            setShowMessage({
                innerText: "Something went wrong. Please Log In again.",
                className: "alert alert-danger",
                role: "alert"
            });

        }
        else if (sessionStorage.getItem("Logout")) {
            sessionStorage.clear();
            setShowMessage({
                innerText: "Successfully Logged out.",
                className: "alert alert-danger",
                role: "alert"
            });
        }
    }, []);

    // When Login Button is clicked
    const LoginBtnOnClick = async (e) => {
        e.preventDefault();
        setCount(count => count + 1);

        const email = document.getElementById('EmailTxt').value;
        const password = document.getElementById('PasswordTxt').value;

        if (!email || !password) {
            setShowMessage({
                innerText: "Please Enter User Name and Password to Login.",
                className: "alert alert-danger",
                role: "alert"
            });
            return;
        }

        setLoggingIn(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await handleLoginSuccess();
        } catch {
            handleLoginError();
        }
    };

    // For Login Success
    const handleLoginSuccess = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_LOGIN_API_URL);
            let name = response.data.name;
            localStorage.setItem("UserName", name);
            setUserName(name)
        } catch {
            handleRequestError();
        }
    };

    // For Login Error
    const handleLoginError = () => {
        setShowMessage({
            innerText: "Entered User Name or Password is incorrect. Please Try Again.",
            className: "alert alert-danger",
            role: "alert"
        });

        clearPasswordInput();
        setLoggingIn(false);
    };

    // Something went wrong
    const handleRequestError = () => {
        setShowMessage({
            innerText: "Something went wrong.",
            className: "alert alert-danger",
            role: "alert"
        });

        clearPasswordInput();
        setLoggingIn(false);
    };

    // Clear the Password
    const clearPasswordInput = () => {
        document.getElementById('PasswordTxt').value = "";
    };


    // Show or disable the show password
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
                                                    autoComplete="on"
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

export default LoginForm;
