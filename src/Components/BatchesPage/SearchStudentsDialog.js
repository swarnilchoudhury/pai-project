import React, { useEffect, useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem as ActionMenuItem } from 'material-react-table';
import { Delete, Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';

const SearchStudentsDialog = ({ open, onClose, batches, onStudentsChanged }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [targetBatchId, setTargetBatchId] = useState('');
    const [isSavingStudentBatch, setIsSavingStudentBatch] = useState(false);

    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();
    const isStudentUnassigned = (student) => student?.batchId === 'N/A';

    const keepDialogOpen = (closeFunction) => (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }

        closeFunction();
    };

    const fetchStudents = async () => {
        try {
            setIsLoadingStudents(true);
            const response = await axios.get(process.env.REACT_APP_GET_STUDENTS_API_URL);
            setStudents(Array.isArray(response.data) ? response.data : []);
        } catch {
            handleErrorMessage();
            setStudents([]);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchStudents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSearch = async () => {
        if (selectedStudents.length === 0) {
            showDialogBox({
                showButtons: true,
                dialogTextTitle: 'Error',
                dialogTextContent: 'Please select at least one student',
                showCancelBtn: false,
                showDefaultButton: true,
                dialogTextButton: 'OK'
            });
            return;
        }

        try {
            setIsSearching(true);
            const response = await axios.post(
                process.env.REACT_APP_BATCHES_SEARCH_STUDENTS_API_URL || 'batches/searchStudents',
                { studentIds: selectedStudents.map((student) => student.id) }
            );
            setResults(Array.isArray(response.data) ? response.data : []);
            setHasSearched(true);
        } catch {
            handleErrorMessage();
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSelectedStudents([]);
        setResults([]);
        setHasSearched(false);
        setTargetBatchId('');
        setSelectedStudent(null);
        setShowMoveDialog(false);
    };

    const refreshResults = async () => {
        if (selectedStudents.length === 0) {
            setResults([]);
            return;
        }

        const response = await axios.post(
            process.env.REACT_APP_BATCHES_SEARCH_STUDENTS_API_URL || 'batches/searchStudents',
            { studentIds: selectedStudents.map((student) => student.id) }
        );
        setResults(Array.isArray(response.data) ? response.data : []);
    };

    const handleDeleteStudent = async (student) => {
        const deleteFunction = async () => {
            try {
                showDialogBox({
                    dialogTextTitle: 'Processing',
                    dialogTextContent: 'Removing student from batch...',
                    showButtons: false
                });

                await axios.post(
                    process.env.REACT_APP_STUDENT_REMOVE_FROM_BATCH_API_URL,
                    { id: student.id, status: 'Active' }
                );

                await refreshResults();
                onStudentsChanged();

                showDialogBox({
                    showButtons: true,
                    dialogTextTitle: 'Success',
                    dialogTextContent: 'Student removed from batch successfully',
                    showCancelBtn: false,
                    showDefaultButton: true,
                    dialogTextButton: 'OK'
                });
            } catch {
                handleErrorMessage();
            }
        };

        showDialogBox({
            showButtons: true,
            dialogTextTitle: 'Remove Student',
            dialogTextContent: `Remove ${student.studentName} from ${student.batchName}?`,
            dialogTextButtonOnConfirm: 'Remove',
            clickFunctionsOnConfirmFunction: deleteFunction,
            showCancelBtn: true
        });
    };

    const handleMoveStudent = (student) => {
        setSelectedStudent(student);
        setTargetBatchId('');
        setShowMoveDialog(true);
    };

    const handleConfirmMove = async () => {
        if (!targetBatchId) {
            showDialogBox({
                showButtons: true,
                dialogTextTitle: 'Error',
                dialogTextContent: 'Please select a target batch',
                showCancelBtn: false,
                showDefaultButton: true,
                dialogTextButton: 'OK'
            });
            return;
        }

        try {
            setIsSavingStudentBatch(true);
            showDialogBox({
                dialogTextTitle: 'Processing',
                dialogTextContent: isStudentUnassigned(selectedStudent)
                    ? 'Adding student to batch...'
                    : 'Moving student...',
                showButtons: false
            });

            if (isStudentUnassigned(selectedStudent)) {
                await axios.put(
                    `${process.env.REACT_APP_BATCHES_ADD_STUDENT_API_URL}/${targetBatchId}`,
                    { id: [selectedStudent.id] }
                );
            }
            else {
                await axios.post(
                    process.env.REACT_APP_STUDENT_MOVE_API_URL,
                    { studentId: selectedStudent.id, fromBatchId: selectedStudent.batchId, toBatchId: targetBatchId }
                );
            }

            setShowMoveDialog(false);
            await refreshResults();
            onStudentsChanged();

            showDialogBox({
                showButtons: true,
                dialogTextTitle: 'Success',
                dialogTextContent: isStudentUnassigned(selectedStudent)
                    ? 'Student added to batch successfully'
                    : 'Student moved successfully',
                showCancelBtn: false,
                showDefaultButton: true,
                dialogTextButton: 'OK'
            });
        } catch {
            handleErrorMessage();
        } finally {
            setIsSavingStudentBatch(false);
        }
    };

    const columns = useMemo(
        () => [
            { accessorKey: 'studentName', header: 'Student Name' },
            { accessorKey: 'studentCode', header: 'Student Code' },
            { accessorKey: 'batchName', header: 'Batch Name' },
            { accessorKey: 'day', header: 'Day' },
            { accessorKey: 'timeSlot', header: 'Time Slot' }
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: results,
        enableRowActions: true,
        enableRowSelection: false,
        enableStickyHeader: true,
        muiTableHeadCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: 'lightgrey', fontWeight: 'bold' } },
        muiTableBodyCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: '#ffffff' } },
        renderEmptyRowsFallback: () => (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography>No records found</Typography>
            </Box>
        ),
        renderRowActionMenuItems: ({ row, table, closeMenu }) => {
            if (isStudentUnassigned(row.original)) {
                return [
                    <ActionMenuItem
                        icon={<AddIcon />}
                        key="add-to-batch"
                        label="Add to Batch"
                        table={table}
                        onClick={() => {
                            closeMenu();
                            handleMoveStudent(row.original);
                        }}
                    />
                ];
            }

            return [
                <ActionMenuItem
                    icon={<Edit />}
                    key="move"
                    label="Move to Other Batch"
                    table={table}
                    onClick={() => {
                        closeMenu();
                        handleMoveStudent(row.original);
                    }}
                />,
                <ActionMenuItem
                    icon={<Delete />}
                    key="delete"
                    label="Delete"
                    table={table}
                    onClick={() => {
                        closeMenu();
                        handleDeleteStudent(row.original);
                    }}
                />
            ];
        },
        state: { isLoading: isSearching },
        muiSkeletonProps: { animation: 'pulse', height: 28 }
    });

    return (
        <>
            <Dialog open={open} onClose={keepDialogOpen(onClose)} fullWidth maxWidth="md">
                <DialogTitle>Search Students</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            loading={isLoadingStudents}
                            options={students}
                            getOptionLabel={(option) => option.studentDetails || ''}
                            value={selectedStudents}
                            onChange={(event, value) => setSelectedStudents(value)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            sx={{
                                width: '100%',
                                mt: 1,
                                '& .MuiInputLabel-root': {
                                    backgroundColor: '#fff',
                                    px: 0.5
                                },
                                '& .MuiOutlinedInput-root': {
                                    alignItems: 'center',
                                    minHeight: 56,
                                    pt: 0.5,
                                    pb: 0.5
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Students"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoadingStudents ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                disabled={isSearching || selectedStudents.length === 0}
                                sx={{ minWidth: 130 }}
                            >
                                {isSearching ? 'Searching...' : 'Search'}
                            </Button>
                            {hasSearched && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CloseIcon />}
                                    onClick={handleClearSearch}
                                    disabled={isSearching}
                                    sx={{ minWidth: 130 }}
                                >
                                    Clear
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {hasSearched && <MaterialReactTable table={table} />}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" startIcon={<CloseIcon />} onClick={onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showMoveDialog} onClose={keepDialogOpen(() => setShowMoveDialog(false))} fullWidth maxWidth="sm">
                <DialogTitle>
                    {isStudentUnassigned(selectedStudent) ? 'Add Student to Batch' : 'Move Student to Another Batch'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedStudent && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                <strong>Student:</strong> {selectedStudent.studentName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Current Batch:</strong> {selectedStudent.batchName}
                            </Typography>
                        </Box>
                    )}
                    <FormControl fullWidth>
                        <InputLabel>Select Target Batch</InputLabel>
                        <Select
                            value={targetBatchId}
                            onChange={(e) => setTargetBatchId(e.target.value)}
                            label="Select Target Batch"
                        >
                            {batches.filter((batch) => batch.id !== selectedStudent?.batchId).map((batch) => (
                                <MenuItem key={batch.id} value={batch.id}>
                                    {batch.batchName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMoveDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmMove}
                        variant="contained"
                        color="primary"
                        disabled={isSavingStudentBatch}
                    >
                        {isSavingStudentBatch
                            ? (isStudentUnassigned(selectedStudent) ? 'Adding...' : 'Moving...')
                            : (isStudentUnassigned(selectedStudent) ? 'Add' : 'Move')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SearchStudentsDialog;
