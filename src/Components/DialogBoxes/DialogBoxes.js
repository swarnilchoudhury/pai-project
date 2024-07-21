import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { auth } from '../Configs/FirebaseConfig';
import { useNavigationInterceptor } from '../AxiosInterceptor/Navigate';

const DialogBoxes = ({ TextDialogContent, TextDialogTitle, TextDialogButton }) => {

    const navigate = useNavigationInterceptor();

    const [open, setOpen] = useState(true);

    const BtnOnClick = async (e, buttonText) => {
        if (buttonText === "YES") {
            await LogoutBtnOnClick();
        }
    }

    const LogoutBtnOnClick = async () => {

        let response = await auth.signOut();
        if (response !== null) {
            sessionStorage.clear();
            sessionStorage.setItem("Logout", "Logout");
            navigate("/login");
            localStorage.clear();
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {TextDialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {TextDialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={e => BtnOnClick(e, TextDialogButton)} autoFocus>
                        {TextDialogButton}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DialogBoxes
