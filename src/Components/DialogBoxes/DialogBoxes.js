import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDialogBox } from '../../Context/DialogBoxContext';

const DialogBoxes = () => {
    const { showDialogBoxContent } = useDialogBox();

    const [open, setOpen] = useState(false); // To toggle the Dialog Box

    useEffect(() => {
        if (showDialogBoxContent.dialogTextContent !== '') {
            setOpen(true);
        }
        else {
            setOpen(false);
        }

    }, [showDialogBoxContent])
    // Function to handle closing the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Function triggered by clicking the button (OK or Confirm button)
    const BtnOnClick = async () => {
        if (showDialogBoxContent.showDefaultButton) {
            handleClose();  // Close dialog on OK button click
        }
    };

    return (
        <div>
            <Dialog
                open={open}  // Controlled by the local open state
                onClose={handleClose}  // Close the dialog when clicking outside or pressing escape
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {showDialogBoxContent.dialogTextTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {showDialogBoxContent.dialogTextContent}
                    </DialogContentText>
                </DialogContent>
                {
                    showDialogBoxContent.showButtons && <DialogActions>
                        {showDialogBoxContent.showCancelBtn && (
                            <Button onClick={handleClose}>Cancel</Button>  // Close on cancel button
                        )}
                        {showDialogBoxContent.showDefaultButton ? (
                            <Button onClick={BtnOnClick} autoFocus>
                                {showDialogBoxContent.dialogTextButton}
                            </Button>
                        ) : (
                            showDialogBoxContent.dialogTextButtonOnConfirm === 'Delete' ?
                                <Button
                                    id={showDialogBoxContent.dialogTextButtonOnConfirmId}
                                    color='error'
                                    onClick={showDialogBoxContent.clickFunctionsOnConfirmFunction}
                                    autoFocus
                                >
                                    {showDialogBoxContent.dialogTextButtonOnConfirm}
                                </Button>
                                :
                                <Button
                                    id={showDialogBoxContent.dialogTextButtonOnConfirmId}
                                    onClick={showDialogBoxContent.clickFunctionsOnConfirmFunction}
                                    autoFocus
                                >
                                    {showDialogBoxContent.dialogTextButtonOnConfirm}
                                </Button>
                        )}
                    </DialogActions>
                }
            </Dialog>
        </div>
    );
};

export default DialogBoxes;
