import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import AddIcon from '@mui/icons-material/Add';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import HistoryIcon from '@mui/icons-material/History';
import TransitionsModal from '../Modal/TransitionsModal';
import MiscTable from '../Table/MinimalTable';

const BatchDetailView = ({ batchId, onBack, onAddStudents }) => {
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [historyTableDetails, setHistoryTableDetails] = useState({
        showTable: false,
        header: [],
        data: [],
        isLoadingState: false,
        isEnableTopToolbar: false,
        pageSize: 5
    });
    const [historyModalCount, setHistoryModalCount] = useState(0);

    const { handleErrorMessage } = useErrorMessageHandler();

    // Fetch batch and its students
    useEffect(() => {
        fetchBatchAndStudents();
    }, [batchId]);

    // Fetch batch and students details
    const fetchBatchAndStudents = async () => {
        try {
            setIsLoading(true);

            // Fetch all batches to get batch details
            const batchesResponse = await axios.get(process.env.REACT_APP_BATCHES_ALL_API_URL);
            const batchesData = Array.isArray(batchesResponse.data) ? batchesResponse.data : [];
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
            {/* Top Bar with Back and Add Students Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                    >
                        Back to Batches
                    </Button>
                    {onAddStudents && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={onAddStudents}
                        >
                            Add Students
                        </Button>
                    )}
                </Box>
                <Button
                    variant="contained"
                    startIcon={<HistoryIcon />}
                    onClick={fetchBatchAuditHistory}
                >
                    History
                </Button>
            </Box>

            {/* Batch Details Title */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Batch Details
            </Typography>

            {/* Batch Info Details - One Line */}
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
                    <MiscTable
                        columnsProps={[
                            { accessorKey: 'studentName', header: 'Student Name' },
                            { accessorKey: 'studentCode', header: 'Student Code' }
                        ]}
                        dataProps={students}
                        isLoadingState={false}
                        isEnableTopToolbar={false}
                        pageSize={10}
                    />
                ) : (
                    <Paper sx={{ p: 2 }}>
                        <Typography>No students in this batch yet.</Typography>
                    </Paper>
                )}
            </Box>

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
