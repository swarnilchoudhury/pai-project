import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    TextField,
    Typography
} from '@mui/material';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';

const CreateBatch = ({ onClose, onCreated, allBatches = [] }) => {
    const [day, setDay] = useState('Monday');
    const [timeSlot, setTimeSlot] = useState('Morning');
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingTeachers, setIsFetchingTeachers] = useState(false);
    const [error, setError] = useState('');
    const [disabledTimeSlots, setDisabledTimeSlots] = useState({});

    // Generate auto batch name based on day and time slot
    const generateBatchName = () => {
        return `${day} ${timeSlot} Batch`;
    };

    const batchName = generateBatchName();

    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['Morning', 'Afternoon', 'Evening'];

    // Fetch teachers and calculate disabled time slots
    useEffect(() => {
        fetchTeachers();
        calculateDisabledTimeSlots();
    }, [day, allBatches]);

    // Calculate which time slots are already taken for the selected day
    const calculateDisabledTimeSlots = () => {
        const disabled = {};

        // For the selected day, find which time slots are already taken
        timeSlots.forEach((slot) => {
            const exists = allBatches.some(
                (batch) => batch.day === day && batch.timeSlot === slot
            );
            disabled[slot] = exists;
        });

        setDisabledTimeSlots(disabled);
    };

    // Fetch all teachers
    const fetchTeachers = async () => {
        try {
            setIsFetchingTeachers(true);
            const response = await axios.get(process.env.REACT_APP_BATCH_TEACHERS_ALL_API_URL);
            const teachersData = Array.isArray(response.data) ? response.data : [];
            setTeachers(teachersData);
        } catch (error) {
            setTeachers([]);
        } finally {
            setIsFetchingTeachers(false);
        }
    };

    // Handle save batch
    const handleSaveClick = async () => {
        if (!batchName || batchName.trim().length === 0) {
            setError('Auto-generated batch name is invalid');
            return;
        }

        if (disabledTimeSlots[timeSlot]) {
            setError(`${day} ${timeSlot} already has a batch assigned`);
            return;
        }

        if (selectedTeachers.length === 0) {
            setError('Please select at least one teacher');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const teacherIds = selectedTeachers.map((teacher) => teacher.id);

            await axios.post(
                process.env.REACT_APP_BATCHES_CREATE_API_URL,
                {
                    batchName: batchName,
                    day,
                    timeSlot,
                    teacherIds
                }
            );

            if (onCreated) {
                onCreated();
            }

            onClose();

            showDialogBox({
                dialogTextTitle: 'Success',
                dialogTextContent: `Batch "${batchName}" created successfully!`,
                dialogTextButton: 'OK',
                showDefaultButton: true,
                showButtons: true
            });
        } catch (error) {
            setError('Failed to save batch');
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        onClose();
    };

    return (
        <>
            <DialogTitle>Create New Batch</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Batch Name (Auto-generated, Read-only) */}
                <TextField
                    fullWidth
                    label="Batch Name"
                    value={batchName}
                    disabled
                    margin="normal"
                    variant="outlined"
                />

                {/* Day Selection */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Day</InputLabel>
                    <Select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        label="Day"
                        disabled={isLoading}
                    >
                        {daysOfWeek.map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Time Slot Selection (with disabled options) */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Time Slot</InputLabel>
                    <Select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        label="Time Slot"
                        disabled={isLoading}
                    >
                        {timeSlots.map((ts) => (
                            <MenuItem
                                key={ts}
                                value={ts}
                                disabled={disabledTimeSlots[ts]}
                            >
                                {ts}
                                {disabledTimeSlots[ts] && ' (Already assigned)'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Teacher Selection - Multi-Select */}
                <Box sx={{ mt: 2, mb: 2 }}>
                    <InputLabel sx={{ mb: 1 }}>Select Teachers</InputLabel>
                    <Autocomplete
                        multiple
                        options={teachers}
                        getOptionLabel={(option) => option.teacherName || ''}
                        value={selectedTeachers}
                        onChange={(e, value) => setSelectedTeachers(value || [])}
                        disabled={isLoading || isFetchingTeachers}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Teachers"
                                placeholder="Select one or more teachers..."
                            />
                        )}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveClick}
                    variant="contained"
                    color="success"
                    disabled={isLoading || selectedTeachers.length === 0 || disabledTimeSlots[timeSlot]}
                >
                    {isLoading ? 'CREATING...' : 'CREATE'}
                </Button>
            </DialogActions>
        </>
    );
};

export default CreateBatch;
