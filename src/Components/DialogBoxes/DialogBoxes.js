import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { auth } from '../../Configs/FirebaseConfig';
import PropTypes from 'prop-types';

const DialogBoxes = ({ TextDialogContent,
    TextDialogTitle,
    TextDialogButton,
    showCancelBtn,
    showDefaultTextDialogButton = true,
    TextDialogButtonOnConfirmId,
    TextDialogButtonOnConfirm,
    clickFunctionsOnConfirm }) => {

    // Props validations
    DialogBoxes.propTypes = {
        TextDialogContent: PropTypes.string,
        TextDialogTitle: PropTypes.string,
        TextDialogButton: PropTypes.object,
        showCancelBtn: PropTypes.bool,
        showDefaultTextDialogButton: PropTypes.bool,
        TextDialogButtonOnConfirmId: PropTypes.string,
        TextDialogButtonOnConfirm: PropTypes.string,
        clickFunctionsOnConfirm: PropTypes.func
    };

    const [open, setOpen] = useState(true);

    const BtnOnClick = async () => {
        if (TextDialogButton === "Logout") {
            await LogoutBtnOnClick();
        }
        else {
            setOpen(false);
        }
    }

    const LogoutBtnOnClick = async () => {
        sessionStorage.clear();
        sessionStorage.setItem("Logout", "Logout");
        await auth.signOut();
    }

    const handleClose = () => { // Close the Dialog Box
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
                    {showCancelBtn && <Button onClick={handleClose}>Cancel</Button>}
                    {showDefaultTextDialogButton ? <Button onClick={BtnOnClick} autoFocus>
                        {TextDialogButton}
                    </Button>
                        :
                        <Button id={TextDialogButtonOnConfirmId} onClick={clickFunctionsOnConfirm} autoFocus>
                            {TextDialogButtonOnConfirm}
                        </Button>
                    }

                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DialogBoxes
