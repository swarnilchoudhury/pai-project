import { useState, useEffect } from 'react';
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

    const [view, setView] = useState(null);

    const [batches, setBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateBatchDialog, setShowCreateBatchDialog] = useState(false);
    const [showCreateTeacherDialog, setShowCreateTeacherDialog] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    const { handleErrorMessage } = useErrorMessageHandler();

    const createSlug = (batchName) =>
        batchName.toLowerCase().replace(/\s+/g, '').replace(/[^\w\-]/g, '');

    const findBatchIdBySlug = (slug) => {
        const batch = batches.find((b) => createSlug(b.batchName) === slug);
        return batch?.id || null;
    };

    // Permissions redirect
    useEffect(() => {
        if (editPermissions === false) {
            navigate('/Home/Active');
        }
    }, [editPermissions, navigate]);

    // Page title
    useEffect(() => {
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('/view')) document.title = 'View Batch';
        else if (path.endsWith('/add')) document.title = 'Add Students Batch';
        else document.title = 'Batches Dashboard';
    }, [view, batchSlug]);


    useEffect(() => {
        if (editPermissions === true) {
            fetchBatches();
        }
    }, [editPermissions, refreshCount]);

    const fetchBatches = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(process.env.REACT_APP_BATCHES_ALL_API_URL);
            setBatches(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    // Routing based on slug
    useEffect(() => {
        if (!batchSlug) {
            setView('table');
            return;
        }

        if (batches.length === 0) return;

        const id = findBatchIdBySlug(batchSlug);

        if (id) {
            setSelectedBatchId(id);
            setView(action === 'view' ? 'detail' : 'add-students');
        } else {
            navigate('/Batches/dashboard');
        }
    }, [batchSlug, batches, action, navigate]);

    const handleRefresh = () => setRefreshCount((p) => p + 1);

    const handleViewDetails = (id, name) => {
        setSelectedBatchId(id);
        setView('detail');
        navigate(`/Batches/${createSlug(name)}/view`);
    };

    const handleAddStudents = (id, name) => {
        setSelectedBatchId(id);
        setView('add-students');
        navigate(`/Batches/${createSlug(name)}/add`);
    };

    const renderTableView = () => (
        <Box sx={{ p: { xs: 2, sm: 6 } }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateBatchDialog(true)}>
                    Create New Batch
                </Button>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateTeacherDialog(true)}>
                        Add New Teacher
                    </Button>
                    <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ overflowX: 'auto' }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Batch Name</TableCell>
                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Students</TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Teachers</TableCell>
                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {batches.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{b.batchName}</TableCell>
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {b.studentIds?.length || 0}/24
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            {Array.isArray(b.teacherNames) ? b.teacherNames.join(', ') : b.teacherName}
                                        </TableCell>
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            <MuiLink component="button" onClick={() => handleViewDetails(b.id, b.batchName)}>View</MuiLink>
                                            <Box component="span" sx={{ mx: 1 }}>|</Box>
                                            <MuiLink component="button" onClick={() => handleAddStudents(b.id, b.batchName)}>Add</MuiLink>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Box>
    );

    const renderDetailView = () => (
        <BatchDetailView
            batchId={selectedBatchId}
            onBack={() => {
                setView('table');
                navigate('/Batches/dashboard');
            }}
            onAddStudents={() => {
                const b = batches.find(x => x.id === selectedBatchId);
                if (b) navigate(`/Batches/${createSlug(b.batchName)}/add`);
            }}
        />
    );

    const renderAddStudentsView = () => {
        const b = batches.find(x => x.id === selectedBatchId);
        return (
            <Box sx={{ p: 6 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    sx={{ width: { sm: 'auto' }, mb: 2 }}
                    onClick={() => navigate('/Batches/dashboard')}
                >
                    BACK
                </Button>
                <AddStudentsToBatch
                    batchId={selectedBatchId}
                    batchName={b?.batchName || ''}
                    currentStudentCount={b?.studentIds?.length || 0}
                    onStudentsAdded={() => {
                        setRefreshCount((p) => p + 1);
                        navigate('/Batches/dashboard');
                    }}
                />
            </Box>
        );
    };

    return (
        <Container maxWidth="lg">
            {view === null && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            )}
            {view === 'table' && renderTableView()}
            {view === 'detail' && renderDetailView()}
            {view === 'add-students' && renderAddStudentsView()}

            <Dialog open={showCreateBatchDialog}>
                <CreateBatch onClose={() => setShowCreateBatchDialog(false)} onCreated={handleRefresh} allBatches={batches} />
            </Dialog>

            <Dialog
                open={showCreateTeacherDialog}
                fullWidth
                maxWidth="sm"
            >
                <CreateTeacher onClose={() => setShowCreateTeacherDialog(false)} />
            </Dialog>
        </Container>
    );
};

export default BatchesPage;