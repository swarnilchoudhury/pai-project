import React, { useState, useEffect } from 'react';
import { auth } from '../FirebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MdOutlineReplay } from "react-icons/md";
import ShowMessagediv from '../../Components/ShowMessagediv.js';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DialogBoxes from '../DialogBoxes.js';
import '../../ComponetsStyles/LoginForm.css';

export default function LoginForm(props) {

    const [count, setCount] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isShowDialogBox, setisShowDialogBox] = useState(false);
    const [showDialogBox, setshowDialogBox] = useState({});

    const [showMessage, setshowMessage] = useState({
        innerText: "",
        className: "",
        role: ""
    });

    let navigate = useNavigate();

    useEffect(() => {
        console.log(props);

        if (props.Message !== null && props.Message) {

            console.log('Hi')

            setCount(count => count + 1);

            setshowDialogBox({
                dialogContent: "Logout Successfull.",
                dialogTitle: "Success",
                CloseButtonName: "OK"
            });
            
            setisShowDialogBox(true);       
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

        let EmailTxt = document.getElementById('EmailTxt');
        let PasswordTxt = document.getElementById('PasswordTxt');       

        if (EmailTxt.value === "" || PasswordTxt.value === "") {

            setshowMessage({
                innerText: "Please Enter User Name and Password to Login.",
                className: "alert alert-danger",
                role: "alert"
            });

        }
        else {

            try {

                let response = await signInWithEmailAndPassword(auth, EmailTxt.value, PasswordTxt.value);
                localStorage.setItem('AuthToken', response.user.accessToken);
                navigate('/Home');

            }
            catch {

                setshowMessage({
                    innerText: "Entered User Name or Password is incorrect. Please Try Again.",
                    className: "alert alert-danger",
                    role: "alert"
                });

                PasswordTxt.value = "";
                navigate('/');

            }


        }
    }

    const ClearBtnOnClick = (e) => {

        e.preventDefault();

        setCount(count => count + 1);

        let EmailTxtOnClearBtn = document.getElementById('EmailTxt');
        let PasswordTxtOnClearBtn = document.getElementById('PasswordTxt');

        EmailTxtOnClearBtn.value = "";
        PasswordTxtOnClearBtn.value = "";

        setshowMessage({
            innerText: "",
            className: "",
            role: ""
        });
    }

    

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };


    return (
        <>
            <section className="vh-200">
                <div className="container py-6 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ "borderRadius": "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <h1 id="hText" className="mb-4">Welcome to PAI</h1>
                                    <p className="mb-4 pText">Please Log In to continue</p>
                                    <form onSubmit={LoginBtnOnClick}>
                                        <div className="form-outline mb-4">
                                        <FormControl sx={{ width: '100%' }} variant="outlined">
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
                                        <Button variant="contained" id="LoginBtn" type="submit">Login</Button>
                                        <Button variant="contained" id="ClearBtn" type="reset" onClick={(e) => ClearBtnOnClick(e)}><MdOutlineReplay />  Clear</Button>
                                        <br />
                                        <br />
                                    </form>
                                    <ShowMessagediv key={count} props={showMessage} />
                                    {isShowDialogBox &&  <DialogBoxes key={count} props={showDialogBox} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

