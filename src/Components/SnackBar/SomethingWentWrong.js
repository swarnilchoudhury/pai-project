import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSnackBar } from '../../Context/SnackBarContext';

export default function CustomizedSnackbars() {
    const { showSomethingWentWrong, setSomethingWentWrong } = useSnackBar();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSomethingWentWrong(false);
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}
                open={showSomethingWentWrong}
                autoHideDuration={4000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{
                        width: '100%', // Default for larger screens
                        marginTop: '4rem',
                        '@media (max-width: 600px)': {
                            width: '70%', // For mobile screens
                        },
                    }}
                >
                    Something went wrong!
                </Alert>
            </Snackbar>
        </div>
    );
}
