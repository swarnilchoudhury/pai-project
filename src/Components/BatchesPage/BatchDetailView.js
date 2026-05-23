import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem as ActionMenuItem } from 'material-react-table';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Edit, Delete } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import AddIcon from '@mui/icons-material/Add';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import useDialogBoxHandler from '../../CustomHooks/DialogBoxHandler';
import HistoryIcon from '@mui/icons-material/History';
import TransitionsModal from '../Modal/TransitionsModal';

const BatchDetailView = ({ batchId, onBack, onAddStudents }) => {
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allBatches, setAllBatches] = useState([]);
    const [historyTableDetails, setHistoryTableDetails] = useState({
        showTable: false,
        header: [],
        data: [],
        isLoadingState: false,
        isEnableTopToolbar: false,
        pageSize: 5
    });
    const [historyModalCount, setHistoryModalCount] = useState(0);
    
    // Move student state
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [targetBatchId, setTargetBatchId] = useState('');

    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();

    // Define columns at top level - before any conditional logic
    const studentColumns = useMemo(
        () => [
            {
                accessorKey: 'studentName',
                header: 'Student Name',
            },
            {
                accessorKey: 'studentCode',
                header: 'Student Code',
            },
        ],
        []
    );

    const studentTable = useMaterialReactTable({
        columns: studentColumns,
        data: students,
        enableRowActions: true,
        enableRowSelection: false,
        enableStickyHeader: true,
        muiTableHeadCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: 'lightgrey', fontWeight: 'bold' } },
        muiTableBodyCellProps: { sx: { border: '1px solid rgba(81, 81, 81, .5)', backgroundColor: '#ffffff' } },
        renderRowActionMenuItems: ({ row, table, closeMenu }) => [
            <ActionMenuItem
                icon={<Delete />}
                key="delete"
                label="Delete"
                table={table}
                onClick={() => {
                    closeMenu();
                    handleDeleteStudent(row.original);
                }}
            />,
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
                icon={<ErrorOutlineIcon />}
                key="audit"
                label="Audit"
                table={table}
                onClick={() => {
                    closeMenu();
                    fetchStudentAuditHistory(row.original.id);
                }}
            />,
        ],
        muiSkeletonProps: { animation: 'pulse', height: 28 },
    });

    // Fetch batch and its students
    useEffect(() => {
        fetchBatchAndStudents();
    }, [batchId]);

    // Fetch batch and students details
    const fetchBatchAndStudents = async () => {
        try {
            setIsLoading(true);

            // Fetch all batches to get batch details and for move dialog
            const batchesResponse = await axios.get(process.env.REACT_APP_BATCHES_ALL_API_URL);
            const batchesData = Array.isArray(batchesResponse.data) ? batchesResponse.data : [];
            setAllBatches(batchesData);
            
            const batchData = batchesData.find((b) => b.id === batchId);

            if (batchData) {
                setBatch(batchData);

                const studentsResponse = await axios.get(`${process.env.REACT_APP_BATCHES_STUDENTS_API_URL}/${batchId}`);
                const batchStudents = Array.isArray(studentsResponse.data) ? studentsResponse.data : [];
                setStudents(batchStudents);
            }
        } catch (error) {
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBatchAuditHistory = async () => {
        try {
            setHistoryModalCount((prevCount) => prevCount + 1);
            const auditPageHeader = [
                { accessorKey: 'systemComments', header: 'Comments' },
                { accessorKey: 'user', header: 'User' },
                { accessorKey: 'updatedDateTime', header: 'Updated Date Time' }
            ];

            setHistoryTableDetails({
                showTable: true,
                header: auditPageHeader,
                data: [],
                isLoadingState: true,
                isEnableTopToolbar: false,
                pageSize: 5
            });

            const response = await axios.post(process.env.REACT_APP_BATCHES_AUDIT_API_URL, { batchId });
            setHistoryTableDetails({
                showTable: true,
                header: auditPageHeader,
                data: Array.isArray(response.data) ? response.data : [],
                isLoadingState: false,
                isEnableTopToolbar: false,
                pageSize: 5
            });
        } catch (error) {
            handleErrorMessage();
        }
    };

    const fetchStudentAuditHistory = async (studentId) => {
        try {
            setHistoryModalCount((prevCount) => prevCount + 1);
            const auditPageHeader = [
                { accessorKey: 'systemComments', header: 'Comments' },
                { accessorKey: 'user', header: 'User' },
                { accessorKey: 'updatedDateTime', header: 'Updated Date Time' }
            ];

            setHistoryTableDetails({
                showTable: true,
                header: auditPageHeader,
                data: [],
                isLoadingState: true,
                isEnableTopToolbar: false,
                pageSize: 5
            });

            const response = await axios.post(process.env.REACT_APP_STUDENT_AUDIT_API_URL, { id: studentId });
            setHistoryTableDetails({
                showTable: true,
                header: auditPageHeader,
                data: Array.isArray(response.data) ? response.data : [],
                isLoadingState: false,
                isEnableTopToolbar: false,
                pageSize: 5
            });
        } catch (error) {
            handleErrorMessage();
        }
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

                setStudents(students.filter(s => s.id !== student.id));
                await fetchBatchAndStudents();
                
                showDialogBox({
                    showButtons: true,
                    dialogTextTitle: 'Success',
                    dialogTextContent: 'Student removed from batch successfully',
                    showCancelBtn: false,
                    showDefaultButton: true,
                    dialogTextButton: 'OK'
                });
            } catch (error) {
                handleErrorMessage();
            }
        };

        showDialogBox({
            showButtons: true,
            dialogTextTitle: 'Remove Student',
            dialogTextContent: `Remove ${student.studentName} from this batch?`,
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
            showDialogBox({ 
                dialogTextTitle: 'Processing', 
                dialogTextContent: 'Moving student...', 
                showButtons: false 
            });

            await axios.post(
                process.env.REACT_APP_STUDENT_MOVE_API_URL,
                { studentId: selectedStudent.id, fromBatchId: batchId, toBatchId: targetBatchId }
            );

            setShowMoveDialog(false);
            await fetchBatchAndStudents();
            
            showDialogBox({
                showButtons: true,
                dialogTextTitle: 'Success',
                dialogTextContent: 'Student moved successfully',
                showCancelBtn: false,
                showDefaultButton: true,
                dialogTextButton: 'OK'
            });
        } catch (error) {
            handleErrorMessage();
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!batch) {
        return (
            <Paper sx={{ p: 3 }}>
                <Alert severity="error">Batch not found</Alert>
            </Paper>
        );
    }

    return (
        <Box sx={{ p: 6 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    Back
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 1
                    }}
                >
                    {onAddStudents && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={onAddStudents}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Add Students
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<HistoryIcon />}
                        onClick={fetchBatchAuditHistory}
                        sx={{
                            whiteSpace: 'nowrap',
                            mt: 1
                        }}
                    >
                        History
                    </Button>
                </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Batch Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, mb: 4, alignItems: 'center', backgroundColor: '#f5f5f5', p: 3, borderRadius: 1, overflow: 'auto', whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        Batch Name:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {batch.batchName}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                        Teachers Assigned:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {Array.isArray(batch.teacherNames) ? batch.teacherNames.join(', ') : batch.teacherName}
                    </Typography>
                </Box>
            </Box>

            {/* Students Table */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Students in Batch ({students.length})
                </Typography>

                {students.length > 0 ? (
                    <MaterialReactTable table={studentTable} />
                ) : (
                    <Paper sx={{ p: 2 }}>
                        <Typography>No students in this batch yet.</Typography>
                    </Paper>
                )}
            </Box>

            {/* Move Student Dialog */}
            <Dialog open={showMoveDialog} onClose={() => setShowMoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Move Student to Another Batch</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedStudent && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                <strong>Student:</strong> {selectedStudent.studentName}
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
                            {allBatches.filter(b => b.id !== batchId).map((b) => (
                                <MenuItem key={b.id} value={b.id}>
                                    {b.batchName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMoveDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmMove} variant="contained" color="primary">
                        Move
                    </Button>
                </DialogActions>
            </Dialog>

            {historyTableDetails.showTable && (
                <TransitionsModal
                    key={historyModalCount}
                    heading='History'
                    columnsProps={historyTableDetails.header}
                    dataProps={historyTableDetails.data}
                    isLoadingState={historyTableDetails.isLoadingState}
                    isEnableTopToolbar={historyTableDetails.isEnableTopToolbar}
                    pageSize={historyTableDetails.pageSize}
                />
            )}
        </Box>
    );
};

export default BatchDetailView;
