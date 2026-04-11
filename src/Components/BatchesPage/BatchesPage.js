import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermissions } from '../../Context/PermissionContext';
import {
    Container,
    Paper,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Dialog,
    Link as MuiLink
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../AxiosInterceptor/AxiosInterceptor';
import useErrorMessageHandler from '../../CustomHooks/ErrorMessageHandler';
import CreateBatch from './CreateBatch';
import BatchDetailView from './BatchDetailView';
import CreateTeacher from './CreateTeacher';
import AddStudentsToBatch from './AddStudentsToBatch';
import '../../ComponetsStyles/BatchesPage.css';

const BatchesPage = () => {
    const navigate = useNavigate();
    const { editPermissions } = usePermissions();
    const { batchSlug } = useParams();
    const action = window.location.pathname.includes('/view')
        ? 'view'
        : window.location.pathname.includes('/add')
            ? 'add'
            : null;
    const [view, setView] = useState('table');
    const [batches, setBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateBatchDialog, setShowCreateBatchDialog] = useState(false);
    const [showCreateTeacherDialog, setShowCreateTeacherDialog] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    const { handleErrorMessage } = useErrorMessageHandler();
    const createSlug = (batchName) => {
        return batchName
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^\w\-]/g, '');
    };

    const findBatchIdBySlug = (slug) => {
        const batch = batches.find((batchData) => createSlug(batchData.batchName) === slug);
        return batch?.id || null;
    };

    useEffect(() => {
        if (editPermissions === false) {
            navigate('/Home/Active');
        }
    }, [editPermissions, navigate]);

    useEffect(() => {
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('/view')) {
            document.title = 'View Batch';
        } else if (path.endsWith('/add')) {
            document.title = 'Add Students Batch';
        } else {
            document.title = 'Batches Dasboard';
        }
    }, [view, batchSlug]);

    useEffect(() => {
        if (!batchSlug) return;

        const batchId = findBatchIdBySlug(batchSlug);

        if (batchId) {
            setSelectedBatchId(batchId);

            if (action === 'view') {
                setView('detail');
            } else if (action === 'add') {
                setView('add-students');
            }
        } else if (batches.length > 0) {
            navigate('/Batches/dashboard');
        }
    }, [batchSlug, action, batches, navigate]);

    const fetchBatches = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(process.env.REACT_APP_BATCHES_ALL_API_URL);
            const batchesData = Array.isArray(response.data) ? response.data : [];
            setBatches(batchesData);
        } catch (error) {
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (editPermissions !== true) {
            return;
        }
        fetchBatches();
    }, [refreshCount, editPermissions]);

    const handleRefresh = () => {
        setRefreshCount((previousCount) => previousCount + 1);
    };

    const handleViewDetails = (batchId, batchName) => {
        setSelectedBatchId(batchId);
        setView('detail');
        navigate(`/Batches/${createSlug(batchName)}/view`);
    };

    const handleAddStudents = (batchId, batchName) => {
        setSelectedBatchId(batchId);
        setView('add-students');
        navigate(`/Batches/${createSlug(batchName)}/add`);
    };

    const renderTableView = () => (
        <Box sx={{ p: 6 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCreateBatchDialog(true)}
                >
                    Create New Batch
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ minWidth: 180 }}
                        onClick={() => setShowCreateTeacherDialog(true)}
                    >
                        Add New Teacher
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, minHeight: 280, alignItems: 'flex-start' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Batch Name</TableCell>
                                <TableCell align="center">Students</TableCell>
                                <TableCell>Teachers</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {batches.map((batch) => (
                                <TableRow key={batch.id}>
                                    <TableCell>{batch.batchName}</TableCell>
                                    <TableCell align="center">
                                        {batch.studentIds?.length || 0}/24
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(batch.teacherNames)
                                            ? batch.teacherNames.join(', ')
                                            : batch.teacherName}
                                    </TableCell>
                                    <TableCell align="center">
                                        <MuiLink
                                            component="button"
                                            sx={{
                                                fontSize: '1.00rem',
                                                fontWeight: 400,
                                                textDecorationThickness: '1px',
                                                textUnderlineOffset: '1px'
                                            }}
                                            onClick={() => handleViewDetails(batch.id, batch.batchName)}
                                        >
                                            View
                                        </MuiLink>

                                        <Box component="span" sx={{ mx: 1, color: 'text.secondary', fontWeight: 600 }}>|</Box>

                                        <MuiLink
                                            component="button"
                                            sx={{
                                                fontSize: '1.00rem',
                                                fontWeight: 400,
                                                textDecorationThickness: '1px',
                                                textUnderlineOffset: '1px'
                                            }}
                                            onClick={() => handleAddStudents(batch.id, batch.batchName)}
                                        >
                                            Add
                                        </MuiLink>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    if (editPermissions === null) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (editPermissions === false) {
        return null;
    }

    const renderDetailView = () => (
        <BatchDetailView
            batchId={selectedBatchId}
            onBack={() => {
                setView('table');
                navigate('/Batches/dashboard');
            }}
            onAddStudents={() => {
                const batch = batches.find((batchData) => batchData.id === selectedBatchId);
                if (batch) {
                    setView('add-students');
                    navigate(`/Batches/${createSlug(batch.batchName)}/add`);
                }
            }}
        />
    );

    const renderAddStudentsView = () => {
        const batch = batches.find((batchData) => batchData.id === selectedBatchId);
        const currentStudentCount = batch?.studentIds?.length || 0;

        return (
            <Box sx={{ py: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    sx={{ ml: 1, mb: 2 }}
                    onClick={() => {
                        setView('table');
                        navigate('/Batches/dashboard');
                    }}
                >
                    BACK
                </Button>

                <AddStudentsToBatch
                    batchId={selectedBatchId}
                    batchName={batch?.batchName || ''}
                    currentStudentCount={currentStudentCount}
                    onStudentsAdded={() => {
                        setRefreshCount((previousCount) => previousCount + 1);
                        setView('table');
                        navigate('/Batches/dashboard');
                    }}
                />
            </Box>
        );
    };

    return (
        <Container>
            {view === 'table' && renderTableView()}
            {view === 'detail' && renderDetailView()}
            {view === 'add-students' && renderAddStudentsView()}

            <Dialog open={showCreateBatchDialog}>
                <CreateBatch
                    onClose={() => setShowCreateBatchDialog(false)}
                    onCreated={() => setRefreshCount((previousCount) => previousCount + 1)}
                    allBatches={batches}
                />
            </Dialog>

            <Dialog
                open={showCreateTeacherDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { minWidth: { xs: 360, sm: 460 } } }}
            >
                <CreateTeacher onClose={() => setShowCreateTeacherDialog(false)} />
            </Dialog>
        </Container>
    );
};

export default BatchesPage;
