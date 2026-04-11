import React, { useState } from 'react';
import {
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';

const CreateTeacher = ({ onClose }) => {
    const [teacherName, setTeacherName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();

    // Handle save teacher
    const handleSaveClick = async () => {
        if (!teacherName.trim()) {
            setError('Teacher name is required');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await axios.post(
                process.env.REACT_APP_BATCH_TEACHERS_CREATE_API_URL,
                { teacherName: teacherName.trim() }
            );

            // Handle response based on message
            const message = response.data?.message;

            if (message === "Teacher already exists") {
                // Reset loading state first, then show dialog
                setIsLoading(false);
                showDialogBox({
                    dialogTextTitle: 'Teacher Already Present',
                    dialogTextContent: `Teacher "${teacherName}" already exists in the system.`,
                    dialogTextButton: 'OK',
                    showDefaultButton: true,
                    showButtons: true,
                    clickFunctionsOnConfirmFunction: () => {
                        // Clear the input for user to try again
                        setTeacherName('');
                    }
                });
                return;
            }

            else {
                // Reset loading state first, then show dialog
                setIsLoading(false);
                showDialogBox({
                    dialogTextTitle: 'Success',
                    dialogTextContent: `Teacher "${teacherName}" created successfully!`,
                    dialogTextButton: 'OK',
                    showDefaultButton: true,
                    showButtons: true,
                    clickFunctionsOnConfirmFunction: () => {
                        onClose();
                    }
                });
                return;
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
            setError('Failed to create teacher');
            setIsLoading(false);
        }
    };

    return (
        <>
            <DialogTitle>Add New Teacher</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    label="Teacher Name"
                    placeholder="Enter teacher name"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    margin="normal"
                    disabled={isLoading}
                    autoFocus
                />
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveClick}
                    variant="contained"
                    color="success"
                    disabled={isLoading || !teacherName.trim()}
                >
                    {isLoading ? 'CREATING...' : 'CREATE'}
                </Button>
            </DialogActions>
        </>
    );
};

export default CreateTeacher;
