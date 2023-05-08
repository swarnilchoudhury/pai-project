import React, { useState } from 'react'
import { auth } from '../Components/FirebaseConfig.js';
import LoginForm from './LoginForm/LoginForm.js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const NavBar = (props) => {
    const [isLogout, setisLogout] = useState(false);
    const [open, setOpen] = useState(false);

    const LogoutBtnOnClick = async () => {
        let response = await auth.signOut();
        if (response !== null) {
            setisLogout(true);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
      };

    const handleClose = () => {
        setOpen(false);
    };

   

    return (
        <>
            {!isLogout ? <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">Welcome, {props.UserName}</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/Home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/Search">Search</a>
                                </li>
                            </ul>
                            <form className="d-flex">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li>
                                        <Button variant="contained" color="error" onClick={handleClickOpen}>
                                            LOGOUT
                                        </Button>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {"Logout"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                   Are you sure you want to logout?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancel</Button>
                                                <Button onClick={LogoutBtnOnClick} autoFocus>
                                                    YES
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>

                : <> <LoginForm Message={true} /> </>}
        </>
    )
}

export default NavBar
